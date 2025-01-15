import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { nanoid } from "nanoid";
import { createIdForm, createIdSchema } from "~/components/music/schema";
import { prisma } from "~/db";

const getMusicIds = defineAction({
    handler: async () => {
        return await prisma.musicId.findMany({
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    },
});

const createMusicId = defineAction({
    accept: "form",
    input: createIdSchema,
    handler: async (input, ctx) => {
        const res = await ctx.locals.form.getData(createIdForm);
        const user = ctx.locals.user;

        if (res?.data) {
            if (!user) {
                return new Response(
                    JSON.stringify({
                        message: "you need to be signed in to do that",
                    }),
                    {
                        status: 401,
                    }
                );
            }

            if (!user.permissions.includes("CREATE_MUSIC_IDS")) {
                return new Response(
                    JSON.stringify({
                        message: "you do not have permission to do that",
                    }),
                    {
                        status: 403,
                    }
                );
            }

            await prisma.musicId.create({
                data: {
                    id: nanoid(21),
                    robloxId: res.data.id,
                    name: res.data.name,
                    creatorId: user.id,
                },
            });
        }
    },
});

const deleteMusicId = defineAction({
    input: z.object({
        id: z.string(),
    }),
    accept: "form",
    handler: async (input, ctx) => {
        const user = ctx.locals.user;

        if (!user)
            throw new ActionError({
                code: "UNAUTHORIZED",
                message: "you need to be logged in to do this.",
            });

        const musicId = await prisma.musicId.findFirst({
            where: {
                id: input.id,
            },
            include: {
                creator: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        if (!musicId)
            throw new ActionError({
                code: "NOT_FOUND",
                message: "that music id doesn't exist",
            });

        if (
            !user.permissions.includes("MANAGE_MUSIC_IDS") &&
            user.id !== musicId.creator.id
        )
            throw new ActionError({
                code: "FORBIDDEN",
                message: "you do not have permission to delete this music id",
            });

        await prisma.musicId.delete({
            where: {
                id: input.id,
            },
        });
    },
});

const music = {
    getMusicIds,
    deleteMusicId,
    createMusicId,
};

export { music };

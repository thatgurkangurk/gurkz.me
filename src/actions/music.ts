import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { prisma } from "~/db";

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
    deleteMusicId,
};

export { music };

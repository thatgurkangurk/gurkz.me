import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { getSession } from "auth-astro/server";
import { eq } from "drizzle-orm";
import { db } from "~/db";
import { musicIds } from "~/db/schema";

const deleteMusicId = defineAction({
    input: z.object({
        id: z.string(),
    }),
    accept: "form",
    handler: async (input, ctx) => {
        const session = await getSession(ctx.request);

        if (!session || !session.user)
            throw new ActionError({
                code: "UNAUTHORIZED",
                message: "you need to be logged in to do this.",
            });

        const musicId = await db.query.musicIds.findFirst({
            where: (table, { eq }) => eq(table.id, input.id),
            with: {
                creator: {
                    columns: {
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
            !session.user.permissions.includes("MANAGE_MUSIC_IDS") &&
            session.user.id !== musicId.creator.id
        )
            throw new ActionError({
                code: "FORBIDDEN",
                message: "you do not have permission to delete this music id",
            });

        await db.delete(musicIds).where(eq(musicIds.id, input.id));
    },
});

const music = {
    deleteMusicId,
};

export { music };

import * as z from "zod/v4";
import { base, orpcPermix } from "../orpc";
import { musicIds } from "../db/schema";
import { eq } from "drizzle-orm";
import { ORPCError } from "@orpc/client";

export const listMusicIds = base
    .input(
        z.compile(
            z.object({
                page: z.number().int().positive().default(1),
                limit: z.number().int().min(1).max(100).default(20),
                search: z.string().default(""),
            }),
        ),
    )
    .use(orpcPermix.checkMiddleware("musicId.list"))
    .handler(async ({ input, context }) => {
        const offset = (input.page - 1) * input.limit;

        return await context.db.query.musicIds.findMany({
            ...(input.search && {
                where: {
                    name: { ilike: `%${input.search}%` },
                },
            }),
            columns: {
                id: true,
                name: true,
                robloxId: true,
                createdById: true,
                createdAt: true,
                working: true,
                tags: true,
            },
            with: {
                creator: {
                    columns: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
            orderBy: ({ id }, { desc }) => desc(id),
            limit: input.limit,
            offset,
        });
    });

export const deleteMusicId = base
    .input(
        z.compile(
            z.object({
                id: z.ulid(),
            }),
        ),
    )
    .handler(async ({ context, input }) => {
        if (!context.session) throw new ORPCError("UNAUTHORIZED");

        const musicIdToDelete = (
            await context.db
                .select()
                .from(musicIds)
                .where(eq(musicIds.id, input.id))
                .limit(1)
        )[0];

        if (!musicIdToDelete) throw new ORPCError("NOT_FOUND");

        if (!context.permix.check("musicId.delete", musicIdToDelete))
            throw new ORPCError("FORBIDDEN");

        try {
            await context.db
                .delete(musicIds)
                .where(eq(musicIds.id, musicIdToDelete.id));
        } catch (err) {
            console.error("failed to delete music id", err);
            throw new ORPCError("INTERNAL_SERVER_ERROR", {
                message: "failed to delete that music id",
            });
        }
    });

export const musicRouter = {
    list: listMusicIds,
    delete: deleteMusicId,
};

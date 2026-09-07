import * as z from "zod/v4";
import { base, orpcPermix } from "../orpc";

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

export const musicRouter = {
    list: listMusicIds,
};

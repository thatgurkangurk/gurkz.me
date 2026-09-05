import { os } from "@orpc/server";
import { db } from "../db";
import * as z from "zod/v4";

export const listMusicIds = os
    .input(
        z.compile(
            z.object({
                page: z.number().int().positive().default(1),
                limit: z.number().int().min(1).max(100).default(20),
                search: z.string().default(""),
            }),
        ),
    )
    .handler(async ({ input }) => {
        const offset = (input.page - 1) * input.limit;

        return await db.query.musicIds.findMany({
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

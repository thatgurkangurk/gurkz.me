import { db } from "../db";
import { users } from "../db/schema";
import { MusicId } from "../music";
import { createCaller, error$ } from "@solid-mediakit/prpc";
import { sql } from "drizzle-orm";
import { z } from "zod";

export const getMusicIdsByUser = createCaller(
    z.object({
        userId: z.string(),
    }),
    async ({ input$ }) => {
        "use server";

        const user = (
            await db
                .select()
                .from(users)
                .where(sql`${users.id} = ${input$.userId}`)
        )[0];

        if (!user)
            return error$("user was not found", {
                status: 404,
            });

        const musicIdsByUser: MusicId[] = await db.query.musicIds.findMany({
            where: (table, { eq }) => eq(table.createdById, input$.userId),
            with: {
                creator: {
                    columns: {
                        name: true,
                        id: true,
                        image: true,
                    },
                },
            },
        });

        return musicIdsByUser;
    }
);

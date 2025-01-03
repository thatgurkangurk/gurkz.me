import { db } from "./db";
import { musicIds } from "./db/schema";
import { User } from "./user";
import { createCaller, error$ } from "@solid-mediakit/prpc";
import { eq } from "drizzle-orm";
import { z } from "zod";

export type MusicId = {
    id: string;
    name: string;
    robloxId: number;
    createdById: string;
    created: Date;
    working: boolean;
    creator: Omit<User, "email" | "emailVerified" | "permissions" | "role">;
};

export const getMusicIds = createCaller(
    async () => {
        "use server";
        const musicIds = await db.query.musicIds.findMany({
            with: {
                creator: {
                    columns: {
                        id: true,
                        image: true,
                        name: true,
                    },
                },
            },
            orderBy: (table, { desc }) => [desc(table.created)],
        });
        return musicIds;
    },
    {
        method: "GET",
        cache: false,
    }
);

export const createMusicIdSchema = z.object({
    id: z
        .string()
        .min(4, {
            message: "id has to be longer than 4 characters",
        })
        .max(24, {
            message: "id has to be shorter than 24 characters",
        })
        .refine((arg) => parseInt(arg), {
            message: "you have to provide a number",
        }),
    name: z
        .string()
        .min(6, {
            message: "the name has to be longer than 6 characters",
        })
        .max(128, {
            message: "the name has to be shorter than 128 characters",
        }),
});

export type CreateMusicIdSchema = z.infer<typeof createMusicIdSchema>;

export const createMusicId = createCaller(
    createMusicIdSchema,
    async ({ input$, session$ }) => {
        "use server";
        if (!session$ || !session$.user) {
            return error$("you need to sign in first");
        }

        if (!session$.user.permissions.includes("CREATE_MUSIC_IDS")) {
            return error$("you do not have permission to do that");
        }

        try {
            await db.insert(musicIds).values({
                robloxId: parseInt(input$.id),
                name: input$.name,
                createdById: session$.user.id,
            });
        } catch (err) {
            console.error(err);
            return error$("something went wrong");
        }

        return true;
    },
    {
        type: "action",
        method: "POST",
    }
);

export const deleteMusicId = createCaller(
    z.object({
        id: z.string(),
    }),
    async ({ input$, session$ }) => {
        "use server";
        if (!session$ || !session$.user) {
            return error$("you need to sign in first");
        }

        const musicId = (
            await db
                .select()
                .from(musicIds)
                .where(eq(musicIds.id, input$.id))
                .limit(1)
        )[0];

        if (!musicId)
            return error$("music id was not found", {
                status: 404,
            });

        if (
            !session$.user.permissions.includes("MANAGE_MUSIC_IDS") ||
            session$.user.id !== musicId.createdById
        ) {
            return error$("you do not have permission to do that");
        }

        await db.delete(musicIds).where(eq(musicIds.id, input$.id));

        return true;
    },
    {
        type: "action",
        method: "POST",
    }
);

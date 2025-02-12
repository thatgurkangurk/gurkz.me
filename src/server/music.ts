import { protectedCaller } from "./actions/auth";
import { db } from "./db";
import { musicIds } from "./db/schema";
import { redis } from "./redis";
import { createCaller, error$ } from "@solid-mediakit/prpc";
import { Ratelimit } from "@upstash/ratelimit";
import { z } from "zod";

async function getMusicIdsFromDb(verifiedOnly: boolean) {
    "use server";
    if (verifiedOnly)
        return await db.query.musicIds.findMany({
            with: {
                creator: {
                    columns: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
            where: (table, { eq }) => eq(table.verified, true),
            orderBy: (table, { desc }) => desc(table.created),
        });

    return await db.query.musicIds.findMany({
        with: {
            creator: {
                columns: {
                    id: true,
                    name: true,
                    image: true,
                },
            },
        },

        orderBy: (table, { desc }) => desc(table.created),
    });
}

const getMusicIds = createCaller(
    z.boolean().default(true),
    async ({ input$ }) => {
        "use server";
        return await getMusicIdsFromDb(input$);
    },
    {
        cache: false,
        method: "GET",
    }
);

const CreateMusicIdSchema = z.object({
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
    tags: z
        .array(
            z
                .string({
                    message: "you need to provide a tag value",
                })
                .nonempty("you have to provide a tag value")
        )
        .max(4, {
            message: "you can only include a maximum of 4 tags",
        })
        .optional(),
});

const createMusicId = protectedCaller(
    CreateMusicIdSchema,
    async ({ input$, ctx$ }) => {
        "use server";

        const ratelimit = new Ratelimit({
            redis: redis,
            limiter: Ratelimit.slidingWindow(2, "10 s"),
            prefix: "@upstash/ratelimit",
        });

        const { success } = await ratelimit.limit(ctx$.user.id);

        if (!success)
            return error$({
                message: "you are being rate limited",
            });

        await db.insert(musicIds).values({
            name: input$.name,
            robloxId: input$.id,
            createdById: ctx$.user.id,
            verified: ctx$.user.permissions.includes("CREATE_MUSIC_IDS"),
            tags: input$.tags,
        });

        return true;
    },
    {
        type: "action",
        method: "POST",
    }
);

type CreateMusicIdForm = z.infer<typeof CreateMusicIdSchema>;

export {
    getMusicIds,
    createMusicId,
    CreateMusicIdSchema,
    type CreateMusicIdForm,
};

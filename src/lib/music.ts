import { action } from "@solidjs/router";
import { Ratelimit } from "@upstash/ratelimit";
import { createForm, validateForm } from "simple-stack-form/module";
import { z } from "zod";
import { auth } from "~/lib/auth/actions";
import { db } from "~/server/db";
import { musicIds } from "~/server/db/schema";
import { redis } from "~/server/redis";

export type MusicId = {
    id: string;
    name: string;
    robloxId: string;
    createdById: string;
    created: Date;
    working: boolean;
    creator: Creator;
    tags: string[];
};

export type Creator = {
    id: string;
    name: string | null;
    image: string | null;
};

const id = z
    .string()
    .min(4, {
        message: "id has to be longer than 4 characters",
    })
    .max(24, {
        message: "id has to be shorter than 24 characters",
    })
    .refine((arg) => parseInt(arg), {
        message: "you have to provide a number",
    });

const name = z
    .string()
    .min(6, {
        message: "the name has to be longer than 6 characters",
    })
    .max(128, {
        message: "the name has to be shorter than 128 characters",
    });

export const createIdForm = createForm({
    id,
    name,
});

async function rateLimit(userId: string) {
    "use server";
    const ratelimit = new Ratelimit({
        redis: redis,
        limiter: Ratelimit.slidingWindow(2, "10 s"),
        prefix: "@upstash/ratelimit",
    });
    const res = await ratelimit.limit(userId);

    return res;
}

export const createMusicIdAction = action(async (formData: FormData) => {
    "use server";
    const user = await auth();

    const parsed = await validateForm({
        formData,
        validator: createIdForm.validator,
    });

    console.log("HELLO?");

    if (!user) {
        //? a bit weird, but works
        parsed.fieldErrors = {
            name: ["not allowed"],
            id: ["not allowed"],
        };
        parsed.data = undefined;
        return parsed;
    }

    const { success } = await rateLimit(user.id).then((res) => {
        console.log("i rate limited :D");
        return res;
    });

    if (!success) {
        parsed.fieldErrors = {
            name: ["woah, slow down there"],
            id: ["woah, slow down there"],
        };
        parsed.data = undefined;
        return parsed;
    }

    if (parsed.data) {
        await db.insert(musicIds).values({
            name: parsed.data.name,
            robloxId: parsed.data.id,
            createdById: user.id,
            verified: user.permissions.includes("CREATE_MUSIC_IDS"),
        });
        return parsed;
    }

    return parsed;
});

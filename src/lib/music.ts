import { action } from "@solidjs/router";
import { createForm, validateForm } from "simple-stack-form/module";
import { z } from "zod";
import { db } from "~/server/db";
import { musicId } from "~/server/db/schema";
import { getSession } from "~/server/session";

export type MusicId = {
    id: string;
    name: string;
    robloxId: string;
    createdById: string;
    created: Date;
    working: boolean;
    creator: Creator;
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

export const createMusicIdAction = action(async (formData: FormData) => {
    "use server";
    const session = await getSession();

    const parsed = await validateForm({
        formData,
        validator: createIdForm.validator,
    });

    if (
        !session?.user ||
        !session.user?.permissions.includes("CREATE_MUSIC_IDS")
    ) {
        //? a bit weird, but works
        parsed.fieldErrors = {
            name: ["not allowed"],
            id: ["not allowed"],
        };
        parsed.data = undefined;
        return parsed;
    }

    if (parsed.data) {
        await db.insert(musicId).values({
            name: parsed.data.name,
            robloxId: parsed.data.id,
            createdById: session.user.id,
        });
        return parsed;
    }

    return parsed;
});

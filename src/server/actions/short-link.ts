import { db } from "../db";
import { shortLinks } from "../db/schema";
import { createCaller, error$ } from "@solid-mediakit/prpc";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const shortLinkSchemas = {
    slug: z
        .string()
        .min(4, {
            message: "slug has to be longer than 4 characters",
        })
        .max(32, {
            message: "slug cannot be longer than 32 characters",
        })
        .refine((str) => !str.startsWith("/"), {
            message: "slug should not start with a slash",
        })
        .refine((str) => /^[a-z0-9-_]+$/.test(str), {
            message:
                "slug can only contain lowercase letters, numbers, hyphens, and underscores",
        })
        .transform((str) => str.toLowerCase()),
    redirect: z.string().url({
        message: "a valid url is required",
    }),
};

export const createShortLinkSchema = z.object({
    slug: shortLinkSchemas.slug,
    redirectTo: shortLinkSchemas.redirect,
});

export const createShortLink = createCaller(
    createShortLinkSchema,
    async ({ input$, session$ }) => {
        "use server";
        if (!session$.user.permissions.includes("CREATE_SHORT_LINKS")) {
            return error$("not allowed", {
                status: 403,
            });
        }

        const [existingSlug] = await db
            .select()
            .from(shortLinks)
            .where(eq(shortLinks.slug, input$.slug));

        if (existingSlug) return error$("that slug already exists");

        await db.insert(shortLinks).values({
            ...input$,
            creatorId: session$.user.id,
        });

        return;
    },
    {
        type: "action",
        method: "POST",
        protected: true,
    }
);

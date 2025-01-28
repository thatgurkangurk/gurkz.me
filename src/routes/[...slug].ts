import { redirect } from "@solidjs/router";
import type { APIEvent } from "@solidjs/start/server";
import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { shortLinks } from "~/server/db/schema";

export async function GET(event: APIEvent) {
    const { slug } = event.params;

    const [shortLink] = await db
        .select()
        .from(shortLinks)
        .where(eq(shortLinks.slug, slug));

    if (shortLink && shortLink.redirectTo) {
        await db
            .update(shortLinks)
            .set({
                clicks: shortLink.clicks + 1,
            })
            .where(eq(shortLinks.slug, slug));
        return redirect(shortLink.redirectTo, {
            status: 302,
        });
    }

    return;
}

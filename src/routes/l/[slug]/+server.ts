import { db } from "#lib/server/db/index.js";
import { shortLink } from "#lib/server/db/schema.js";

import { error, redirect } from "@sveltejs/kit";
import { eq, sql } from "drizzle-orm";
import { isbot } from "isbot";
import { Result, err, ok } from "neverthrow";

import type { RequestHandler } from "./$types";

type LinkError = "NOT_FOUND";

async function fetchAndIncrement(slug: string): Promise<Result<string, LinkError>> {
	const [result] = await db
		.update(shortLink)
		.set({ uses: sql`${shortLink.uses} + 1` })
		.where(eq(shortLink.slug, slug))
		.returning({ location: shortLink.location });

	return result?.location ? ok(result.location) : err("NOT_FOUND");
}

async function fetchOnly(slug: string): Promise<Result<string, LinkError>> {
	const [result] = await db
		.select({ location: shortLink.location })
		.from(shortLink)
		.where(eq(shortLink.slug, slug));

	return result?.location ? ok(result.location) : err("NOT_FOUND");
}

async function getSlugLocationAndIncrement(
	slug: string,
	increment: boolean = true
): Promise<Result<string, LinkError>> {
	return increment ? fetchAndIncrement(slug) : fetchOnly(slug);
}

export const GET: RequestHandler = async ({ request, params }) => {
	const { slug } = params;
	const isBot = isbot(request.headers.get("user-agent"));

	const result = await getSlugLocationAndIncrement(slug, !isBot);

	return result.match(
		(location) =>
			redirect(302, location, {
				external: [location]
			}),
		(errType) => error(404, "short link not found")
	);
};

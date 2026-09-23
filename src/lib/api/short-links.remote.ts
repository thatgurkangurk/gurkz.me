import { CreateShortLinkSchema } from "#lib/schemas/short-link.js";
import { db } from "#lib/server/db/index.js";
import { shortLink } from "#lib/server/db/schema.js";

import { form, query } from "$app/server";

import { adminOnlyGuard } from "./utils";

export const createShortLink = form(CreateShortLinkSchema, async (data) => {
	const { user } = adminOnlyGuard();
	await db.insert(shortLink).values({
		title: data.title,
		location: data.location,
		createdById: user.id,
		slug: data.slug
	});

	await listShortLinks().refresh();
});

export const listShortLinks = query(async () => {
	adminOnlyGuard();
	const allShortLinks = await db.query.shortLink.findMany({
		columns: {
			id: true,
			title: true,
			location: true,
			slug: true,
			uses: true
		},
		orderBy: ({ id }, { desc }) => desc(id)
	});
	return allShortLinks;
});

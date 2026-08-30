import { form, query } from "$app/server";
import { db } from "#lib/server/db/index.js";
import { profile } from "#lib/server/db/schema/profile.js";
import * as z from "zod/v4";

import { ttcoreAdminOnlyGuard } from "./utils";

export const getProfiles = query(async () => {
	ttcoreAdminOnlyGuard();
	const allProfiles = await db.query.profile.findMany();
	return allProfiles;
});

export const createProfile = form(
	z.object({
		line1: z.string(),
		line2: z.string()
	}),
	async (data) => {
		ttcoreAdminOnlyGuard();

		await db.insert(profile).values({
			line1: data.line1,
			line2: data.line2
		});

		await getProfiles().refresh();
	}
);

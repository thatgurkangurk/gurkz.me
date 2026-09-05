import { createPermix } from "#lib/permix.js";
import { db } from "#lib/server/db/index.js";
import { error } from "@sveltejs/kit";
import { getSessionFromApiKey } from "#lib/server/api-helpers.js";

export async function GET({ request }) {
	const authResult = await getSessionFromApiKey(request);

	if (authResult.isErr()) {
		const authErr = authResult.error;

		switch (authErr.type) {
			case "UNAUTHORIZED":
				throw error(401, authErr.message);
			case "RATE_LIMITED":
				throw error(429, authErr.message);
			case "INTERNAL_SERVER_ERROR":
				throw error(500, authErr.message);
			default:
				throw error(500, "internal server error");
		}
	}

	const { user } = authResult.value;

	const permix = createPermix(user);

	if (!permix.check("musicId.list")) error(403, "you do not have permission to do this");

	const musicIds = await db.query.musicIds.findMany({
		columns: {
			id: true,
			name: true,
			robloxId: true,
			createdById: true,
			createdAt: true,
			working: true,
			tags: true
		},
		with: {
			creator: {
				columns: {
					id: true,
					name: true,
					image: true
				}
			}
		},
		orderBy: ({ id }, { desc }) => desc(id)
	});

	return Response.json(musicIds);
}

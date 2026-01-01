import { auth } from "$lib/server/auth";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";

export const load = (async (ev) => {
	const session = await auth.api.getSession({
		headers: ev.request.headers
	});

	if (!session?.user || !session.user.permissions.includes("VIEW_MUSIC_IDS")) throw error(403);

	const musicIds = await db.query.musicIds.findMany({
		columns: {
			id: true,
			name: true,
			robloxId: true,
			createdById: true,
			created: true,
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

	return { musicIds };
}) satisfies PageServerLoad;

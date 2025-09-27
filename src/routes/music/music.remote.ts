import { query } from "$app/server";
import { db } from "$lib/server/db";

export const getMusicIds = query(async () => {
	const ids = await db.query.musicIds.findMany({
		columns: {
			id: true,
			name: true,
			robloxId: true,
			createdById: true,
			created: true,
			working: true,
			verified: true,
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

	return ids;
});

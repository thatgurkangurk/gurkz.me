import { db } from "$lib/db";
import type { MusicId } from "$lib/music";

async function getMusicIds() {
	const ids: MusicId[] = await db.query.musicIds.findMany({
		with: {
			creator: {
				columns: {
					username: true,
					profilePictureUrl: true,
				},
			},
		},
		columns: {
			createdById: false,
		},
		orderBy: (id, { desc }) => desc(id.created),
	});

	return ids;
}

export { getMusicIds };

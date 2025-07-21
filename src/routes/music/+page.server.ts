import { db } from "$lib/server/db";

export async function load() {
	const musicIds = await db.query.musicIds.findMany();

	return {
		musicIds: musicIds
	};
}

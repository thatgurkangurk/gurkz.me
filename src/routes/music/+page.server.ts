import { db } from "$lib/server/db";

export async function load() {
	console.log("load?");
	const musicIds = await db.query.musicIds.findMany();
	console.log(musicIds);

	return {
		musicIds: musicIds
	};
}

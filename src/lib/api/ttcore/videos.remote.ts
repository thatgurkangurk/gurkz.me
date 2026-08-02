import { query } from "$app/server";
import { db } from "$lib/server/db";

export const listVideos = query(async () => {
	const videos = await db.query.video.findMany();

	return videos;
});

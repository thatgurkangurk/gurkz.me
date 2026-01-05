import * as z from "zod/v4";
import { command, getRequestEvent, query } from "$app/server";
import { error } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { musicIds } from "$lib/server/db/schema/music";
import { eq } from "drizzle-orm";

const getMusicIds = query(async () => {
	const event = getRequestEvent();

	if (!event.locals.user || !event.locals.user.permissions.includes("VIEW_MUSIC_IDS")) error(403);

	return await db.query.musicIds.findMany({
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
});

const deleteMusicId = command(
	z.object({
		id: z.ulid()
	}),
	async ({ id }) => {
		const event = getRequestEvent();

		if (!event.locals.user) error(401);

		const musicIdToDelete = (
			await db.select().from(musicIds).where(eq(musicIds.id, id)).limit(1)
		)[0];

		if (!musicIdToDelete) error(404);

		const isCreator = musicIdToDelete.createdById === event.locals.user.id;

		const canManage = event.locals.user.permissions.includes("MANAGE_MUSIC_IDS");

		if (!isCreator && !canManage) error(403);

		try {
			await db.delete(musicIds).where(eq(musicIds.id, musicIdToDelete.id));
		} catch (err) {
			console.error("failed to delete music id", err);
			error(500, "Failed to delete music id");
		}

		getMusicIds().refresh();

		return {
			success: true
		};
	}
);

export { deleteMusicId, getMusicIds };

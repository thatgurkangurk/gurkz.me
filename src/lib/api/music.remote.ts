import * as z from "zod/v4";
import { command, form, getRequestEvent, query } from "$app/server";
import { error } from "@sveltejs/kit";
import { db } from "#lib/server/db/index.js";
import { musicIds } from "#lib/server/db/schema.js";
import { eq } from "drizzle-orm";
import { createMusicIdSchema } from "../../routes/music/schemas";

const createMusicId = form(createMusicIdSchema, async (data) => {
	const event = getRequestEvent();

	if (!event.locals.user || !event.locals.user.permissions.includes("CREATE_MUSIC_IDS")) error(403);

	try {
		await db.insert(musicIds).values({
			createdById: event.locals.user.id,
			name: data.name,
			tags: data.tags,
			robloxId: data.robloxId
		});
	} catch (err) {
		console.error("creating music id failed", err);
	}
});

const getMusicIds = query(async () => {
	const event = getRequestEvent();

	if (!event.locals.user || !event.locals.user.permissions.includes("VIEW_MUSIC_IDS")) error(403);

	return await db.query.musicIds.findMany({
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

export { createMusicId, deleteMusicId, getMusicIds };

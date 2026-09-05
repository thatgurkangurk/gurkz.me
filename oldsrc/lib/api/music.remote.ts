import * as z from "zod/v4";
import { command, form, getRequestEvent, query } from "$app/server";
import { error } from "@sveltejs/kit";
import { db } from "#lib/server/db/index.js";
import { musicIds } from "#lib/server/db/schema.js";
import { eq } from "drizzle-orm";
import { createMusicIdSchema } from "../../routes/music/schemas";

const createMusicId = form(createMusicIdSchema, async (data) => {
	const event = getRequestEvent();

	if (!event.locals.user || !event.locals.permix.check("musicId.create")) error(403);

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

const getMusicIds = query(
	z.object({
		page: z.number().int().positive().default(1),
		limit: z.number().int().min(1).max(100).default(20),
		search: z.string().default("")
	}),
	async ({ page = 1, limit = 20, search = "" }) => {
		const event = getRequestEvent();

		if (!event.locals.user || !event.locals.permix.check("musicId.list")) error(403);

		const offset = (page - 1) * limit;

		return await db.query.musicIds.findMany({
			...(search && {
				where: {
					name: { ilike: `%${search}%` }
				}
			}),
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
			orderBy: ({ id }, { desc }) => desc(id),
			limit,
			offset
		});
	}
);

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

		if (!event.locals.permix.check("musicId.delete", musicIdToDelete)) error(403);

		try {
			await db.delete(musicIds).where(eq(musicIds.id, musicIdToDelete.id));
		} catch (err) {
			console.error("failed to delete music id", err);
			error(500, "Failed to delete music id");
		}

		return {
			success: true
		};
	}
);

export { createMusicId, deleteMusicId, getMusicIds };

import { createMusicIdSchema } from "#lib/features/music/schemas.js";
import { musicIdRefetchOptions } from "#lib/schemas/music.js";
import { db } from "#lib/server/db/index.js";
import { musicIds } from "#lib/server/db/schema.js";

import { command, form, getRequestEvent, query } from "$app/server";
import { error } from "@sveltejs/kit";
import { count, eq, ilike } from "drizzle-orm";
import * as z from "zod/v4";

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

		void getMusicIds({
			page: data.currentPage,
			limit: data.limit,
			search: data.searchFilter
		}).refresh();
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

		const whereClause = search ? ilike(musicIds.name, `%${search}%`) : undefined;

		const [totalResult, musicIdsResult] = await Promise.all([
			db.select({ count: count() }).from(musicIds).where(whereClause),
			db.query.musicIds.findMany({
				...(search && {
					where: { name: { ilike: `%${search}%` } }
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
			})
		]);

		const totalItems = totalResult[0]?.count ?? 0;
		const totalPages = Math.ceil(totalItems / limit);

		return {
			data: musicIdsResult,
			pagination: {
				page,
				limit,
				totalItems,
				totalPages,
				hasNextPage: page < totalPages,
				hasPrevPage: page > 1
			}
		};
	}
);

const deleteMusicId = command(
	z.object({
		id: z.ulid(),
		...musicIdRefetchOptions.shape
	}),
	async ({ id, currentPage, limit, searchFilter }) => {
		const event = getRequestEvent();

		if (!event.locals.user) error(401);

		const musicIdToDelete = (
			await db.select().from(musicIds).where(eq(musicIds.id, id)).limit(1)
		)[0];

		if (!musicIdToDelete) error(404);

		if (!event.locals.permix.check("musicId.delete", musicIdToDelete)) error(403);

		try {
			await db.delete(musicIds).where(eq(musicIds.id, musicIdToDelete.id));

			void getMusicIds({
				page: currentPage,
				limit: limit,
				search: searchFilter
			}).refresh();
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

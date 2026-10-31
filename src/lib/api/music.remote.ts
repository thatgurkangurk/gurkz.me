import { createMusicIdSchema } from "#lib/features/music/schemas.js";
import { orpc } from "#lib/orpc.js";
import { musicIdRefetchOptions } from "#lib/schemas/music.js";
import { db } from "#lib/server/db/index.js";
import { musicIds } from "#lib/server/db/schema.js";
import { DeleteMusicIdArgs, FetchMusicIdsArgs } from "#lib/server/orpc/routers/music.js";
import { handleOrpc } from "#lib/server/orpc/util.js";

import { command, form, getRequestEvent, query } from "$app/server";
import { error } from "@sveltejs/kit";
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

const getMusicIds = query(FetchMusicIdsArgs, async ({ page = 1, limit = 20, search = "" }) => {
	const result = await handleOrpc(() => orpc.music.list({ page, limit, search }));

	return result;
});

const deleteMusicId = command(
	z.object({
		...DeleteMusicIdArgs.shape,
		...musicIdRefetchOptions.shape
	}),
	async ({ id, currentPage, limit, searchFilter }) => {
		const result = await handleOrpc(() => orpc.music.delete({ id: id }));

		void getMusicIds({
			page: currentPage,
			limit: limit,
			search: searchFilter
		}).refresh();

		return result;
	}
);

export { createMusicId, deleteMusicId, getMusicIds };

import { createMusicIdSchema } from "#lib/features/music/schemas.js";
import { orpc } from "#lib/orpc.js";
import { musicIdRefetchOptions } from "#lib/schemas/music.js";
import { DeleteMusicIdArgs, FetchMusicIdsArgs } from "#lib/server/orpc/routers/music.js";
import { handleOrpc } from "#lib/server/orpc/util.js";

import { command, form, query } from "$app/server";
import * as z from "zod/v4";

const createMusicId = form(createMusicIdSchema, async (data) => {
	const result = await handleOrpc(() => orpc.music.create(data));

	void getMusicIds({
		page: data.currentPage,
		limit: data.limit,
		search: data.searchFilter
	}).refresh();

	return result;
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

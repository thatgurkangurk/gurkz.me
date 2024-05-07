import { db } from "$lib/db/client";
import { musicIds } from "$lib/db/schema/music-id";
import type { GetMusicIdsResponse } from "$lib/types";
import { count } from "drizzle-orm";
import type { RequestHandler } from "./$types";

const pageSize = 8;

async function getIds(page = 1) {
	const data = await db
		.select({
			robloxId: musicIds.robloxId
		})
		.from(musicIds)
		.limit(pageSize)
		.offset((page - 1) * pageSize);

	return data;
}

export const GET: RequestHandler = async ({ url }) => {
	const page = Number(url.searchParams.get("page")) ?? 1;
	const totalCount = (await db.select({ count: count() }).from(musicIds))[0].count;
	const maxPageCount = totalCount / pageSize;

	const ids = await getIds(page);

	if (maxPageCount <= page) {
		const data = {
			data: ids,
			next: undefined
		} satisfies GetMusicIdsResponse;

		return new Response(JSON.stringify(data));
	}

	const data = {
		data: ids,
		next: page + 1
	} satisfies GetMusicIdsResponse;

	return new Response(JSON.stringify(data));
};

import type { RequestHandler } from "./$types";
import { getMusicIds } from "$lib/music-id";
import type { GetMusicIdsResponse } from "$lib/music-id/type";

export const GET: RequestHandler = async ({ url, locals }) => {
	const page = Number(url.searchParams.get("page")) ?? 1;

	const ids = await getMusicIds(locals.pb, page);

	if (ids.totalPages <= page) {
		const data = {
			data: ids.items,
			next: undefined
		} satisfies GetMusicIdsResponse;

		return new Response(JSON.stringify(data));
	}

	const data = {
		data: ids.items,
		next: page + 1
	} satisfies GetMusicIdsResponse;

	return new Response(JSON.stringify(data));
};

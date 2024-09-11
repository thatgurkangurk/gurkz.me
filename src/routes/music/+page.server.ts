import { getMusicIds } from "$lib/server/music";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
	const ids = await getMusicIds();

	return {
		ids,
	};
};

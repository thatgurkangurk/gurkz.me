import type { PageServerLoad } from "./$types";
import { adminGuard } from "./guard";

export const load = (async (ev) => {
	adminGuard(ev);

	return {};
}) satisfies PageServerLoad;

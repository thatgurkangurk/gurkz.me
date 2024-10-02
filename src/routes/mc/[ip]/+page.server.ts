import { getStatus } from "../lib/status";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
	const ip = event.params.ip;

	const status = await getStatus(ip);

	return { status };
};

import sanitize, { type IOptions } from "sanitize-html";
import { getStatus } from "../lib/status";
import type { PageServerLoad } from "./$types";

const sanitiseOptions = {
	allowedTags: ["span"],
	allowedAttributes: {
		span: ["style"],
	},
} satisfies IOptions;

export const load: PageServerLoad = async (event) => {
	const ip = event.params.ip;

	const status = await getStatus(ip);

	if (status.online) {
		status.motd.html[0] = sanitize(status.motd.html[0], sanitiseOptions);
		status.motd.html[1] = sanitize(status.motd.html[1], sanitiseOptions);
	}

	return { status };
};

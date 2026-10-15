import { auth } from "#lib/server/auth.js";

import { error } from "@sveltejs/kit";

import { GURKANS_USER_ID } from "./utils.js";

export async function gurkanOnlyApiKeyGuard(key: string) {
	const data = await auth.api.verifyApiKey({
		body: {
			key: key
		}
	});

	if (!data.valid) {
		error(403, data.error?.code || "invalid api key");
	}

	if (data.key?.referenceId !== GURKANS_USER_ID)
		error(403, "you do not have permission to do this");
}

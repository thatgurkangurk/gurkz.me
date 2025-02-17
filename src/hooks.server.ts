import { createAuthClient, setTokens } from "$lib/server/auth";
import { subjects } from "$lib/server/auth-subject";
import { type Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
	const client = createAuthClient(event);
	try {
		const accessToken = event.cookies.get("access_token");
		if (accessToken) {
			const refreshToken = event.cookies.get("refresh_token");
			const verified = await client.verify(subjects, accessToken, { refresh: refreshToken });
			if (!verified.err) {
				if (verified.tokens) setTokens(event, verified.tokens.access, verified.tokens.refresh);
				event.locals.session = verified.subject.properties;
				return resolve(event);
			}
		}
	} catch (e) {
		console.error(e);
	}

	return resolve(event);
};

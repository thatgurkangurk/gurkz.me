import { createAuthClient, setTokens } from "$lib/server/auth";
import { subjects } from "$lib/server/auth-subject";
import { getOrCreateUser } from "$lib/server/auth/actions";
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

				const user = await getOrCreateUser(
					verified.subject.properties.id,
					verified.subject.properties.username
				);

				event.locals.session = {
					username: user.name,
					...user
				};
				return resolve(event);
			}

			throw verified.err;
		}
	} catch (e) {
		console.error(e);
	}

	return resolve(event);
};

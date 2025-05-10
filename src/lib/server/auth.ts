import { env } from "$lib/env";
import { createClient } from "@openauthjs/openauth/client";
import type { RequestEvent } from "@sveltejs/kit";
import { subjects } from "./auth-subject";
import { getOrCreateUser } from "./auth/actions";

export function createAuthClient(event: RequestEvent) {
	return createClient({
		clientID: env.PASSPORT_CLIENT_ID,
		issuer: env.REMOTE_AUTH_HOST,
		fetch: event.fetch
	});
}

export function setTokens(event: RequestEvent, access: string, refresh: string) {
	event.cookies.set("refresh_token", refresh, {
		httpOnly: true,
		sameSite: "lax",
		path: "/",
		maxAge: 34560000
	});
	event.cookies.set("access_token", access, {
		httpOnly: true,
		sameSite: "lax",
		path: "/",
		maxAge: 34560000
	});
}

export async function getSession({ event }: { event: RequestEvent }) {
	const client = createAuthClient(event);
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

			return {
				username: user.name,
				...user
			};
		}

		throw verified.err;
	}
}

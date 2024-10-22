import { createDiscordSession } from "$lib/server/auth/discord";
import { OAuth2RequestError } from "arctic";
import { redirect } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import * as auth from "$lib/server/auth/index";
import { dev } from "$app/environment";

function sanitiseRedirectUrl(url: string) {
	if (!url.startsWith("/")) {
		// tried to redirect outside of the website
		return "/";
	}

	return url;
}

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get("code");
	const state = event.url.searchParams.get("state");
	const storedState = event.cookies.get("discord_oauth_state") ?? null;
	const redirectTo = event.cookies.get("redirect") ?? "/";

	if (!code || !state || !storedState || state !== storedState) {
		return new Response(null, {
			status: 400,
		});
	}

	try {
		const session = await createDiscordSession(code);
		if (!session)
			return new Response(null, {
				status: 400,
			});
		event.cookies.set(auth.sessionCookieName, session.id, {
			path: "/",
			sameSite: "lax",
			httpOnly: true,
			expires: session.expiresAt,
			secure: !dev,
		});
		event.cookies.delete("redirect", {
			path: "/",
		});
	} catch (e) {
		if (e instanceof OAuth2RequestError) {
			// invalid code
			return new Response(null, {
				status: 400,
			});
		}

		return new Response(null, {
			status: 500,
		});
	} finally {
		redirect(302, sanitiseRedirectUrl(redirectTo));
	}
}

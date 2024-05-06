import { generateState } from "arctic";
import type { RequestEvent } from "./$types";
import { discord } from "$lib/auth/providers";
import { dev } from "$app/environment";
import { redirect } from "@sveltejs/kit";

export async function GET(event: RequestEvent) {
	const state = generateState();
	const redirectUrl = `${event.url.protocol}://${event.url.host}/auth/callback/discord`;
	const url = await discord.createAuthorizationURL(state, {
		scopes: ["identify", "email"]
	});

	event.cookies.set("discord_oauth_state", state, {
		path: "/",
		secure: !dev,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: "lax"
	});

	redirect(302, url.toString());
}

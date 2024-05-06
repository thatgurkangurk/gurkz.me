import { discord } from "$lib/auth/providers";
import { db } from "$lib/db/client";
import type { RequestEvent } from "./$types";
import { Permission, users } from "$lib/db/schema/user";
import { eq } from "drizzle-orm";
import { lucia } from "$lib/auth/lucia";
import { nanoid } from "nanoid";
import { OAuth2RequestError } from "arctic";

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get("code");
	const state = event.url.searchParams.get("state");
	const storedState = event.cookies.get("discord_oauth_state") ?? null;

	if (!code || !state || !storedState || state !== storedState)
		return new Response(null, {
			status: 400
		});

	try {
		const tokens = await discord.validateAuthorizationCode(code);
		const discordUserResponse = await fetch("https://discord.com/api/users/@me", {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});
		const discordUser: DiscordUser = await discordUserResponse.json();
		const existingUser = (
			await db.select().from(users).where(eq(users.discordId, discordUser.id))
		)[0];

		if (existingUser) {
			const session = await lucia.createSession(existingUser.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: ".",
				...sessionCookie.attributes
			});
		} else {
			const userId = nanoid(32);
			await db.insert(users).values({
				id: userId,
				discordId: discordUser.id,
				username: discordUser.username,
				permissions: [Permission.STANDARD],
				email: discordUser.email
			});

			const session = await lucia.createSession(userId, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: ".",
				...sessionCookie.attributes
			});
		}

		return new Response(null, {
			status: 302,
			headers: {
				Location: "/"
			}
		});
	} catch (e) {
		console.error(e);
		// the specific error message depends on the provider
		if (e instanceof OAuth2RequestError) {
			// invalid code
			return new Response(null, {
				status: 400
			});
		}
		return new Response(null, {
			status: 500
		});
	}
}

type DiscordUser = {
	id: number;
	username: string;
	email: string;
};

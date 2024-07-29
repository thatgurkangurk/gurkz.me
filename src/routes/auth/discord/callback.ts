import { redirect } from "@solidjs/router";
import { OAuth2RequestError } from "arctic";
import { createError, getCookie, getQuery, setCookie } from "vinxi/http";
import { discord } from "~/lib/auth/clients";
import { createDiscordSession } from "~/lib/auth/discord";
import { createSessionCookie } from "~/lib/auth/session";

export async function GET() {
	const query = getQuery();
	const code = query.code?.toString() ?? null;
	const state = query.state?.toString() ?? null;
	const storedState = getCookie("discord_oauth_state") ?? null;
	if (!code || !state || !storedState || state !== storedState) {
		throw createError({
			status: 400,
		});
	}

	try {
		const session = await createDiscordSession(code);
		if (!session) {
			console.log("no session");
			return new Response(
				JSON.stringify({
					message: "failed to create session",
				}),
				{
					status: 500,
				},
			);
		}

		const sessionCookie = createSessionCookie(session);
		setCookie(
			sessionCookie.name,
			sessionCookie.value,
			sessionCookie.attributes,
		);
		return redirect("/");
	} catch (e) {
		console.error(e);
		if (e instanceof OAuth2RequestError) {
			// invalid code
			throw createError({
				status: 400,
			});
		}
		throw createError({
			status: 500,
		});
	}
}

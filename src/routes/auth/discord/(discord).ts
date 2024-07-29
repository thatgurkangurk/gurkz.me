import { generateState } from "arctic";
import { setCookie } from "vinxi/http";
import { getDiscordAuthorisationUrl } from "~/lib/auth/discord";
import { isDev } from "solid-js/web";

export async function GET() {
	const state = generateState();
	const url = await getDiscordAuthorisationUrl(state);

	setCookie("discord_oauth_state", state, {
		path: "/",
		secure: !isDev,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: "lax",
	});
	return Response.redirect(url.toString());
}

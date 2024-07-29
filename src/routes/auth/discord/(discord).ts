import { generateState } from "arctic";
import { setCookie } from "vinxi/http";
import { getDiscordAuthorisationUrl } from "~/lib/auth/discord";
import { isDev } from "solid-js/web";
import { redirect } from "@solidjs/router";

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
	return redirect(url.toString());
}

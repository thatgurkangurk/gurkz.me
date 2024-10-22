import * as auth from "$lib/server/auth/index";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { getDiscordAuthorisationUrl } from "$lib/server/auth/discord";
import { generateState } from "arctic";

export const load: PageServerLoad = async () => {
	redirect(301, "/auth/discord");
};

export const actions: Actions = {
	discord: async (event) => {
		const formData = await event.request.formData();

		const redirectTo = formData.get("redirect") ?? "/";

		const state = generateState();
		const url = await getDiscordAuthorisationUrl(state);

		event.cookies.set("discord_oauth_state", state, {
			path: "/",
			secure: import.meta.env.PROD,
			httpOnly: true,
			maxAge: 60 * 10,
			sameSite: "lax",
		});

		event.cookies.set("redirect", redirectTo.toString(), {
			path: "/",
			secure: import.meta.env.PROD,
			httpOnly: true,
			maxAge: 60 * 10,
			sameSite: "lax",
		});

		redirect(302, url);
	},
	logout: async (event) => {
		const formData = await event.request.formData();
		const redirectTo = formData.get("redirect") ?? "/";
		if (!event.locals.session) {
			return fail(401);
		}
		await auth.invalidateSession(event.locals.session.id);
		event.cookies.delete(auth.sessionCookieName, { path: "/" });
		redirect(302, redirectTo.toString());
	},
};

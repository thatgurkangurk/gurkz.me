import { setTokens } from "$lib/server/auth";
import { subjects } from "$lib/server/auth-subject";
import { client } from "$lib/server/auth/client";
import { redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
	login: async (event) => {
		const accessToken = event.cookies.get("access_token");
		const refreshToken = event.cookies.get("refresh_token");

		if (accessToken) {
			const verified = await client.verify(subjects, accessToken, { refresh: refreshToken });
			if (!verified.err && verified.tokens) {
				setTokens(event, verified.tokens.access, verified.tokens.refresh);
				return redirect(302, "/");
			}
		}

		const headers = event.request.headers;
		const host = headers.get("host");
		const protocol = host?.includes("localhost") ? "http" : "https";
		const { url } = await client.authorize(`${protocol}://${host}/api/callback`, "code");
		return redirect(302, url);
	},
	logout: async (event) => {
		event.cookies.delete("access_token", { path: "/" });
		event.cookies.delete("refresh_token", { path: "/" });

		return redirect(302, "/");
	}
};

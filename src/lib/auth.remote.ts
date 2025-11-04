import { form, getRequestEvent, query } from "$app/server";
import { redirect } from "@sveltejs/kit";
import { auth } from "./server/auth";
import { SocialProvider } from "./schemas/auth";
import * as v from "valibot";

export const getSession = query(() => {
	return auth.api.getSession({
		headers: getRequestEvent().request.headers
	});
});

export const signIn = form(
	v.object({
		provider: SocialProvider,
		redirectTo: v.optional(v.string())
	}),
	async (input) => {
		const res = await auth.api.signInSocial({
			body: { provider: input.provider, callbackURL: input.redirectTo }
		});
		if (res.redirect) redirect(307, res.url!);
	}
);

export const signOut = form(async () => {
	const { request } = getRequestEvent();
	await auth.api.signOut({ headers: request.headers });
	getSession().refresh();
	return redirect(303, "/");
});

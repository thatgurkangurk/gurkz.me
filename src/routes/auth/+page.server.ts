import { lucia } from "$lib/auth";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { getDiscordAuthorisationUrl } from "$lib/auth/discord";
import { generateState } from "arctic";

export const load: PageServerLoad = async () => {
    redirect(301, "/auth/discord")
};

export const actions: Actions = {
    discord: async (event) => {
        const formData = await event.request.formData();

        const redirectTo = formData.get("redirect") ?? "/"

        const state = generateState();
        const url = await getDiscordAuthorisationUrl(state);
    
        event.cookies.set("discord_oauth_state", state, {
            path: "/",
            secure: import.meta.env.PROD,
            httpOnly: true,
            maxAge: 60 * 10,
            sameSite: "lax"
        });

        event.cookies.set("redirect", redirectTo.toString(), {
            path: "/",
            secure: import.meta.env.PROD,
            httpOnly: true,
            maxAge: 60 * 10,
            sameSite: "lax"
        })
    
        redirect(302, url);
    },
    logout: async (event) => {
        const formData = await event.request.formData();
        const redirectTo = formData.get("redirect") ?? "/"
        if (!event.locals.session) {
			return fail(401);
		}
		await lucia.invalidateSession(event.locals.session.id);
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});
		redirect(302, redirectTo.toString());
    }
};
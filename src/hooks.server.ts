import type { Handle } from "@sveltejs/kit";
import { auth } from "$lib/server/auth.js";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { building } from "$app/env";
import type { User } from "$lib/auth";

export const handle: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user as User;
	}

	return svelteKitHandler({ event, resolve, auth, building });
};

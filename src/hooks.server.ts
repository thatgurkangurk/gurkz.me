import type { Handle, ServerInit } from "@sveltejs/kit/hooks";
import { auth } from "#lib/server/auth.js";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { building } from "$app/env";
import type { User } from "#lib/server/auth.js";
import { db } from "#lib/server/db/index.js";
import { createServerPermix } from "#lib/permix.js";

let isShutdownRegistered = false;

export const init: ServerInit = async () => {
	if (isShutdownRegistered) return;
	isShutdownRegistered = true;

	process.on("sveltekit:shutdown", async (reason) => {
		await db.$client.end();
	});
};

export const handle: Handle = async ({ event, resolve }) => {
	let session: Awaited<ReturnType<typeof auth.api.getSession>> = null;

	try {
		session = await auth.api.getSession({
			headers: event.request.headers
		});
	} catch {
		session = null;
	}

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user as User;
	}

	event.locals.permix = createServerPermix(session?.user as User | undefined);

	return svelteKitHandler({
		event,
		resolve,
		auth,
		building
	});
};

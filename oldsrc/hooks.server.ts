import type { Handle, ServerInit } from "@sveltejs/kit/hooks";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { createPermix } from "#lib/permix.js";
import type { User } from "#lib/server/auth.js";
import { auth } from "#lib/server/auth.js";
import { db } from "#lib/server/db/index.js";
import { building } from "$app/env";

let isShutdownRegistered = false;

export const init: ServerInit = async () => {
	if (isShutdownRegistered) return;
	isShutdownRegistered = true;

	process.on("sveltekit:shutdown", async (reason) => {
		await db.$client.end();
	});
};

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith("/api/") && event.request.method === "OPTIONS") {
		return new Response(null, {
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type, Authorization"
			}
		});
	}

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

	event.locals.permix = createPermix(session?.user as User | undefined);

	const response = await svelteKitHandler({
		event,
		resolve,
		auth,
		building
	});

	if (event.url.pathname.startsWith("/api/")) {
		response.headers.set("Access-Control-Allow-Origin", "*");
		response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
		response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
	}

	return response;
};

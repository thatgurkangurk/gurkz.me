import { createPermix } from "#lib/permix.js";
import { initialPreferences, userPreferencesSchema } from "#lib/preferences.svelte.js";
import type { User } from "#lib/server/auth.js";
import { auth } from "#lib/server/auth.js";
import { db } from "#lib/server/db/index.js";

import { building } from "$app/env";
import type { Handle, ServerInit } from "@sveltejs/kit/hooks";
import { svelteKitHandler } from "better-auth/svelte-kit";
import * as cookie from "cookie";

let isShutdownRegistered = false;

export const init: ServerInit = async () => {
	if (isShutdownRegistered) return;
	isShutdownRegistered = true;

	process.on("sveltekit:shutdown", async (reason) => {
		await db.$client.end();
	});
};

export const preferencesHook: Handle = async ({ event, resolve }) => {
	const rawCookieHeader = event.request.headers.get("cookie") || "";
	const parsedCookies = cookie.parseCookie(rawCookieHeader);
	const raw = parsedCookies.user_preferences;

	if (raw) {
		try {
			event.locals.preferences = userPreferencesSchema.parse(JSON.parse(raw));
		} catch {
			event.locals.preferences = initialPreferences;
		}
	} else {
		event.locals.preferences = initialPreferences;
	}

	return resolve(event);
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

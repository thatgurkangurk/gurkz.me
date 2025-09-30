import { auth } from "$lib/server/auth";
import { building } from "$app/environment";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { sequence } from "@sveltejs/kit/hooks";
import type { Handle } from "@sveltejs/kit";

const handleOrpc: Handle = async ({ event, resolve }) => {
	const { createServerClient } = await import("$lib/orpc.server.js");
	globalThis.$client = createServerClient(() => event.request.headers);

	return resolve(event);
};

const handleAuth: Handle = async ({ event, resolve }) => {
	return svelteKitHandler({ event, resolve, auth, building });
};

export const handle = sequence(handleAuth, handleOrpc);

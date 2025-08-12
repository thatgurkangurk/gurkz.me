import { auth } from "$lib/server/auth";
import { building } from "$app/environment";
import { svelteKitHandler } from "better-auth/svelte-kit";

export async function handle({ event, resolve }) {
	await import("$lib/orpc.server.js");
	return svelteKitHandler({ event, resolve, auth, building });
}

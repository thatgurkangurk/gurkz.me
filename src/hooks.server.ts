import PocketBase from "pocketbase";
import type { Handle } from "@sveltejs/kit";
import { createTRPCHandle } from "trpc-sveltekit";
import type { User } from "$lib/user/types";
import { env } from "./env";
import { createContext } from "$lib/trpc/context";
import { sequence } from "@sveltejs/kit/hooks";
import { appRouter } from "$lib/trpc/router";

const authHook: Handle = async ({ event, resolve }) => {
	event.locals.pb = new PocketBase(env.PUBLIC_BACKEND_URL);

	const sessionCookie = event.cookies.get("session");

	if (!sessionCookie) {
		event.locals.user = null;
		return await resolve(event);
	}

	const user: User = await (
		await fetch("https://passport.gurkz.me/api/user/@me", {
			headers: {
				Authorization: `Bearer ${sessionCookie}`
			}
		})
	).json();

	event.locals.user = user;

	return await resolve(event);
};

export const trpcHook: Handle = createTRPCHandle({ router: appRouter, createContext });

export const handle = sequence(authHook, trpcHook);

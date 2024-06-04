import PocketBase from "pocketbase";
import type { Handle } from "@sveltejs/kit";
import { dev } from "$app/environment";
import { parse } from "set-cookie-parser";
import type { User } from "$lib/user/types";
import { env } from "./env";

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.pb = new PocketBase(env.PUBLIC_BACKEND_URL);
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get("cookie") || "");

	// try {
	// 	event.locals.pb.authStore.isValid && (await event.locals.pb.collection("users").authRefresh());
	// 	event.locals.user = event.locals.pb.authStore.model as User;
	// } catch (_) {
	// 	event.locals.pb.authStore.clear();
	// }

	// const cookie = event.locals.pb.authStore.exportToCookie({
	// 	secure: !dev,
	// 	path: "/",
	// 	httpOnly: true,
	// 	sameSite: "lax"
	// });

	// const parsedCookie = parse(cookie);

	// event.cookies.set(parsedCookie[0].name, parsedCookie[0].value, {
	// 	secure: parsedCookie[0].secure,
	// 	path: parsedCookie[0].path ?? "/",
	// 	httpOnly: parsedCookie[0].httpOnly,
	// 	sameSite: "lax"
	// });

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

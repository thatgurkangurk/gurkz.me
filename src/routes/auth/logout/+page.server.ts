import { redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { dev } from "$app/environment";
import { parse } from "set-cookie-parser";

export const actions = {
	default: async ({ cookies, locals }) => {
		if (!locals.pb.authStore.isValid) redirect(302, "/");

		locals.pb.authStore.clear();

		const cookie = locals.pb.authStore.exportToCookie({
			secure: !dev,
			path: "/",
			httpOnly: true,
			sameSite: "lax"
		});

		const parsedCookie = parse(cookie);

		cookies.set(parsedCookie[0].name, parsedCookie[0].value, {
			secure: parsedCookie[0].secure,
			path: parsedCookie[0].path ?? "/",
			httpOnly: parsedCookie[0].httpOnly,
			sameSite: "lax"
		});

		redirect(301, "/");
	}
} satisfies Actions;

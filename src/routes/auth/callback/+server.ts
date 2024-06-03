import { dev } from "$app/environment";
import type { User } from "$lib/user/types";
import { error, redirect } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, cookies, locals }) {
	const token = url.searchParams.get("token");

	if (!token) {
		return error(400, "no token provided");
	}

	cookies.set("session", token, {
		path: "/",
		httpOnly: true,
		sameSite: "lax",
		secure: !dev
	});

	const user: User = await (
		await fetch("https://passport.gurkz.me/api/user/@me", {
			headers: {
				Authorization: `Bearer ${token}`
			}
		})
	).json();

	locals.user = user;

	redirect(302, "/");
}

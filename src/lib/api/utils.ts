import { getRequestEvent } from "$app/server";
import { error } from "@sveltejs/kit";

export function adminOnlyGuard() {
	const { user, session } = authGuard();

	if (!user.admin) error(403);

	return {
		user: user,
		session: session
	};
}

export function authGuard() {
	const ev = getRequestEvent();

	if (!ev.locals.user || !ev.locals.session) error(401, "please sign in to continue");

	return {
		user: ev.locals.user,
		session: ev.locals.session
	};
}

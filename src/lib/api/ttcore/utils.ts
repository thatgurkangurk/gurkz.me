import { getRequestEvent } from "$app/server";
import { error } from "@sveltejs/kit";

export function ttcoreAdminOnlyGuard() {
	const ev = getRequestEvent();
	const { user, session } = authGuard();

	if (!ev.locals.permix.check("ttcore.manage")) error(403);

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

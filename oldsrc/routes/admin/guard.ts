import { error, type ServerLoadEvent } from "@sveltejs/kit";

export function adminGuard(ev: ServerLoadEvent) {
	if (!ev.locals.user) throw error(401, "please sign in to continue");

	if (!ev.locals.user.admin) throw error(403, "sorry, but you cannot access this page");

	return ev;
}

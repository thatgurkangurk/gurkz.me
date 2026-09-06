import { type ServerLoadEvent, error } from "@sveltejs/kit";

export function adminGuard(ev: ServerLoadEvent) {
	if (!ev.locals.user) throw error(401, "please sign in to continue");

	if (!ev.locals.permix.check("ttcore.manage"))
		throw error(403, "sorry, but you cannot access this page");

	return ev;
}

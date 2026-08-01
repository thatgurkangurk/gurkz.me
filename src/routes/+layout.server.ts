import { auth, type Session, type User } from "$lib/server/auth";
import type { LayoutServerLoad } from "./$types";

export const load = (async (ev) => {
	const session = (await auth.api.getSession({
		headers: ev.request.headers
	})) as {
		session: Session;
		user: User;
	} | null;

	return {
		session
	};
}) satisfies LayoutServerLoad;

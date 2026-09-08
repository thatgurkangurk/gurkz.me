import { type Session, type User, auth } from "#lib/server/auth.js";

import type { LayoutServerLoad } from "./$types";

export const load = (async (ev) => {
	const session = (await auth.api.getSession({
		headers: ev.request.headers
	})) as {
		session: Session;
		user: User;
	} | null;

	const permixState = ev.locals.permix.dehydrate();

	return {
		session,
		permixState,
		preferences: ev.locals.preferences
	};
}) satisfies LayoutServerLoad;

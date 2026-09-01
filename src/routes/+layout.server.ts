import { getRules, permix } from "#lib/permix.js";
import { auth, type Session, type User } from "#lib/server/auth.js";
import type { LayoutServerLoad } from "./$types";

export const load = (async (ev) => {
	const session = (await auth.api.getSession({
		headers: ev.request.headers
	})) as {
		session: Session;
		user: User;
	} | null;

	const permixRules = getRules(session?.user);

	permix.setup(permixRules);

	const permixState = permix.dehydrate();

	return {
		session,
		permixState
	};
}) satisfies LayoutServerLoad;

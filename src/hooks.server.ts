import { getSession } from "$lib/server/auth";
import { type Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
	try {
		const user = await getSession({
			event: event
		});

		if (!user) return resolve(event);

		event.locals.session = user;
	} catch (e) {
		console.error(e);
	}

	return resolve(event);
};

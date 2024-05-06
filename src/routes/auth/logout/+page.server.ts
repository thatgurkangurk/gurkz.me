import { fail, redirect } from "@sveltejs/kit";
import { lucia } from "$lib/auth/lucia";

import type { Actions } from "./$types";
import { db } from "$lib/db/client";
import { sessions } from "$lib/db/schema/session";
import { eq } from "drizzle-orm";

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}
		await lucia.invalidateSession(event.locals.session.id);
		await db.delete(sessions).where(eq(sessions.id, event.locals.session.id));
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});
		redirect(302, "/auth/login");
	}
};

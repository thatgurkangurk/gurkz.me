import { form, getRequestEvent, query } from "$app/server";
import { SetNewDisplayNameSchema } from "$lib/schemas/user";
import { auth } from "$lib/server/auth";
import { db } from "$lib/server/db";
import { error } from "@sveltejs/kit";

import { adminOnlyGuard, authGuard } from "./utils";

export const getUsers = query(async () => {
	adminOnlyGuard();
	const allUsers = await db.query.user.findMany({
		columns: {
			id: true,
			username: true,
			name: true,
			email: true
		}
	});
	return allUsers;
});

export const getLinkedAccounts = query(async () => {
	authGuard();
	const res = await auth.api.listUserAccounts({
		headers: getRequestEvent().request.headers
	});
	return res;
});

export const setDisplayName = form(SetNewDisplayNameSchema, async (data) => {
	authGuard();

	const res = await auth.api.updateUser({
		body: {
			name: data.displayName
		},
		headers: getRequestEvent().request.headers
	});

	if (!res.status) throw error(403);
});

import { command, getRequestEvent, query } from "$app/server";
import { requireAdminAuth } from "$lib/auth.js";
import { Permissions } from "$lib/permissions";
import { auth, type User } from "$lib/server/auth.js";
import { error } from "@sveltejs/kit";
import { ResultAsync } from "neverthrow";
import * as v from "valibot";

export const getUsers = query(async () => {
	await requireAdminAuth();
	const { users } = await auth.api.listUsers({
		query: {},
		headers: getRequestEvent().request.headers
	});

	return { users } as { users: User[] };
});

export const getUserById = query(
	v.object({
		userId: v.string()
	}),
	async (input) => {
		await requireAdminAuth();

		const result = await ResultAsync.fromPromise<User, Error>(
			auth.api.getUser({
				query: { id: input.userId },
				headers: getRequestEvent().request.headers
			}) as Promise<User>,
			(e) => e as Error
		);

		if (result.isOk()) {
			return result.value;
		}

		error(404, {
			message: "could not find that user"
		});
	}
);

export const manageUserPermissions = command(
	v.object({
		userId: v.string(),
		permissions: v.optional(v.array(Permissions), [])
	}),
	async ({ permissions, userId }) => {
		await requireAdminAuth();

		const result = await ResultAsync.fromPromise<User, Error>(
			auth.api.adminUpdateUser({
				body: {
					userId: userId,
					data: {
						permissions: permissions
					}
				},
				headers: getRequestEvent().request.headers
			}) as Promise<User>,
			(e) => e as Error
		);

		if (result.isErr()) {
			// return error to the form
			return { success: false, error: result.error.message };
		}

		await getUserById({ userId: userId }).refresh();

		return { success: true, user: result.value };
	}
);

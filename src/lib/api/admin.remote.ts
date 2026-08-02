import { form, query } from "$app/server";
import { db } from "$lib/server/db";
import { error } from "@sveltejs/kit";
import { adminOnlyGuard } from "./utils";
import * as z from "zod/v4";
import {
	SetUserPermissions,
	type NonDefaultPermission
} from "../../routes/admin/users/[userId]/schemas";
import type { Permission } from "$lib/permissions";
import { user } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

export const getUsers = query(async () => {
	adminOnlyGuard();
	const allUsers = await db.query.user.findMany({
		columns: {
			id: true,
			name: true,
			email: true,
			permissions: true,
			image: true,
			username: true
		}
	});
	return allUsers;
});

export const getUserById = query(z.string(), async (userId) => {
	adminOnlyGuard();
	const user = await db.query.user.findFirst({
		columns: {
			id: true,
			name: true,
			email: true,
			permissions: true,
			image: true
		},
		where: {
			id: userId
		}
	});

	if (!user)
		error(404, {
			message: "could not find that user"
		});

	return user;
});

export const setUserPermissions = form(SetUserPermissions, async (data) => {
	adminOnlyGuard();
	const { userId, ...permissionFlags } = data;

	const activePermissions = (Object.entries(permissionFlags) as [NonDefaultPermission, boolean][])
		.filter(([_, isGranted]) => isGranted)
		.map(([permission]) => permission);

	const finalPermissionsArray: Permission[] = ["DEFAULT", ...activePermissions];

	const [newUser] = await db
		.update(user)
		.set({
			permissions: finalPermissionsArray
		})
		.where(eq(user.id, userId))
		.returning({
			id: user.id,
			name: user.name,
			email: user.email,
			permissions: user.permissions,
			image: user.image
		});

	if (!newUser) {
		error(404, {
			message: "could not find that user"
		});
	}

	getUserById(newUser.id).set(newUser);
	getUsers().refresh();
});

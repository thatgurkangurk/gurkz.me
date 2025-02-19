import { permissionsSchema } from "$lib/permissions";
import { rolesSchema } from "$lib/roles";
import * as v from "valibot";

export const userSubject = v.object({
	id: v.string(),
	username: v.string()
});

export const user = v.intersect([
	userSubject,
	v.object({
		email: v.nullable(v.pipe(v.string(), v.email())),
		emailVerified: v.nullable(v.date()),
		image: v.nullable(v.string()),
		permissions: v.array(permissionsSchema),
		role: rolesSchema
	})
]);

export type User = v.InferOutput<typeof user>;

export const subjects = { user: userSubject };

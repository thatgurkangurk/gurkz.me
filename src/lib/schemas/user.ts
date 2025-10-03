import { Permissions } from "$lib/permissions";
import * as v from "valibot";

export const User = v.object({
	id: v.string(),
	name: v.pipe(v.string(), v.nonEmpty()),
	email: v.pipe(v.string(), v.email()),
	emailVerified: v.optional(v.boolean(), false),
	image: v.nullish(v.string()),
	createdAt: v.optional(v.date(), () => new Date()),
	updatedAt: v.optional(v.date(), () => new Date()),
	permissions: v.optional(v.array(Permissions), ["DEFAULT"])
});

export const Session = v.object({
	expiresAt: v.date(),
	token: v.string(),
	createdAt: v.date(),
	updatedAt: v.date(),
	ipAddress: v.nullish(v.string()),
	userAgent: v.nullish(v.string()),
	userId: v.string(),
	id: v.string()
});

import { z } from "zod/v4";
import { Permissions } from "../../lib/permissions";
import { Roles } from "../../lib/roles";

export const userSubject = z.object({
	id: z.string(),
	username: z.string()
});

export const user = userSubject.extend({
	email: z.nullable(z.email()),
	emailVerified: z.nullable(z.string()),
	image: z.nullable(z.string()),
	permissions: z.array(Permissions),
	role: Roles
});

export type User = z.infer<typeof user>;

export const subjects = { user: userSubject };

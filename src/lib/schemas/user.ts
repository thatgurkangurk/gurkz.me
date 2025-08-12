import { Permissions } from "$lib/permissions";
import { z } from "zod/v4";

export const User = z.object({
	id: z.string(),
	name: z.string().min(1),
	email: z.email(),
	emailVerified: z.boolean().default(false),
	image: z.string().nullable().optional(),
	createdAt: z.date().default(() => new Date()),
	updatedAt: z.date().default(() => new Date()),
	permissions: Permissions.array().default(["DEFAULT"])
});

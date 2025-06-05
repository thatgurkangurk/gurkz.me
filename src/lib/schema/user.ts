import z from "zod/v4";
import { Permissions } from "../permissions";
import { Roles } from "../roles";

export const userSchema = z.object({
	id: z.string().length(21),
	name: z.string(),
	email: z.string().email().optional().nullable(),
	emailVerified: z.date().optional().nullable(),
	image: z.string().optional().nullable(),
	permissions: z.array(Permissions).default(["DEFAULT"]),
	role: Roles.default("USER")
});

export type User = z.infer<typeof userSchema>;

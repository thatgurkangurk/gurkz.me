import { type PermissionsDefinition, getRules } from "#lib/permix.js";

import { ORPCError, os } from "@orpc/server";
import { createPermix } from "permix/orpc";

import type { Session, User } from "../auth.js";
import type { db } from "../db/index.js";

type Context = {
	db: typeof db;
	headers: Headers;
	session: {
		session: Session;
		user: User;
	} | null;
};

export const orpcPermix = createPermix<PermissionsDefinition>({
	onForbidden: () => {
		throw new ORPCError("FORBIDDEN", {
			message: "you do not have permission to do that"
		});
	}
});

export const base = os.$context<Context>().use(async ({ context, next }) => {
	return next({
		context: orpcPermix.setupContext(getRules(context.session?.user))
	});
});

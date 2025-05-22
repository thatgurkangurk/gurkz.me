import { os } from "@orpc/server";
import { User } from "../auth/subjects";
import { getSession } from "../auth";
import { db } from "../db";

export const authMiddleware = os
	.$context<{ user?: User | null | undefined }>()
	.middleware(async ({ context, next }) => {
		const session = context.user ?? (await getSession());

		return next({
			context: {
				user: session
			}
		});
	});

export const dbMiddleware = os.$context<{ db?: typeof db }>().middleware(async ({ next }) => {
	return next({ context: { db: db } });
});

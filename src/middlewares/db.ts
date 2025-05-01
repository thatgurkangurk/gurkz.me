import { db } from "$lib/server/db";
import { os } from "@orpc/server";

export const dbProviderMiddleware = os
	.$context<{ db?: typeof db }>()
	.middleware(async ({ next }) => {
		return next({
			context: {
				db: db
			}
		});
	});

import { getDB } from "~/server/db";
import { base } from "../base";

export const dbMiddleware = base
	.$context<{ db?: ReturnType<typeof getDB> }>()
	.middleware(async ({ context, next }) => {
		const db = context.db ?? getDB();

		return next({
			context: {
				db: db
			}
		});
	});

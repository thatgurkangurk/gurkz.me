import { dbMiddleware } from "./orpc/middleware/db";
import { base } from "./orpc/base";
import { authMiddleware } from "./orpc/middleware/auth";
import { ORPCError } from "@orpc/client";

export const or = base.use(dbMiddleware).use(authMiddleware);

export const pub = or;

export const protectedProcedure = or.use(async ({ context, next }) => {
	if (!context.user) {
		throw new ORPCError("FORBIDDEN");
	}

	return next({
		context: {
			user: context.user
		}
	});
});

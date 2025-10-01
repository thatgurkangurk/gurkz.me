import { o } from "../orpc";
import { ORPCError } from "@orpc/client";

export const requireAuthMiddleware = o.middleware(async ({ context, next }) => {
	const { session } = context;

	if (!session) throw new ORPCError("UNAUTHORIZED");

	return next({
		context: {
			session: session
		}
	});
});

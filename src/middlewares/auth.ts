import { ORPCError } from "@orpc/server";
import { or } from "../orpc";

const requireAuth = or.middleware(async ({ context, next }) => {
	if (!context.session) {
		throw new ORPCError("UNAUTHORIZED");
	}

	return next({
		context: {
			...context,
			session: context.session
		}
	});
});

export const authed = or.use(requireAuth);

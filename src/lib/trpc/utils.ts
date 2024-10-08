import { TRPCError, initTRPC } from "@trpc/server";
import type { Context } from "./context";

export const t = initTRPC.context<Context>().create();

export const router = t.router;
export const procedure = t.procedure;
export const protectedProcedure = t.procedure.use(async ({ next, ctx }) => {
	if (!ctx.user) {
		throw new TRPCError({ code: "UNAUTHORIZED" });
	}

	return next({
		ctx: {
			user: ctx.user,
		},
	});
});

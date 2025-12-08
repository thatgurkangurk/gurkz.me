import { ORPCError } from "@orpc/client";
import { protectedMiddleware } from "../permix";

const adminProcedure = protectedMiddleware.use(({ context, next }) => {
  if (!context.session) {
    throw new ORPCError("UNAUTHORIZED");
  }

  if (context.session.user.role !== "admin") throw new ORPCError("FORBIDDEN");

  return next({
    context: {
      session: context.session,
    },
  });
});

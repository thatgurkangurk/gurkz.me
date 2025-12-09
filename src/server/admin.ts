import { createMiddleware, json } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";
import { authMiddleware } from "./tss/auth-middleware";

export const requireAdminMiddleware = createMiddleware({ type: "function" })
  .middleware([authMiddleware])
  .server(async ({ next, context }) => {
    if (!context.session) {
      throw json("Forbidden", {
        status: 403,
      });
    }

    if (!context.session.user?.role || context.session.user.role !== "admin") {
      throw json("Forbidden", {
        status: 403,
      });
    }

    return next();
  });

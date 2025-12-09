import { os } from "@orpc/server";
import { auth } from "../auth";
import { RequestHeadersPluginContext } from "@orpc/server/plugins";
import { Session, User } from "~/lib/auth";

export const authMiddleware = os
  .$context<
    {
      session?: { session: Session; user: User } | null;
    } & RequestHeadersPluginContext
  >()
  .middleware(async ({ context, next }) => {
    if (!context.reqHeaders) {
      console.log("[WARN] no headers");
      return next({
        context: {
          session: null,
        },
      });
    }

    const session =
      context.session ??
      ((await auth.api.getSession({
        headers: context.reqHeaders,
      })) as {
        user: User;
        session: Session;
      } | null);

    return await next({
      context: {
        session: session,
      },
    });
  });

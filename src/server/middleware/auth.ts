import { os } from "@orpc/server";
import { auth, Session, User } from "../auth";

export const authMiddleware = os
  .$context<{
    session?: { session: Session; user: User } | null;
    headers: Headers;
  }>()
  .middleware(async ({ context, next }) => {
    const session =
      context.session ??
      (await auth.api.getSession({
        headers: context.headers,
      }));

    return next({
      context: {
        session: session,
      },
    });
  });

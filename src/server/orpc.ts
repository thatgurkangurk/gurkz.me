import { os } from "@orpc/server";
import { dbMiddleware } from "./middleware/db";
import { auth } from "./auth";
import { authMiddleware } from "./middleware/auth";

export async function createRPCContext(opts: { headers: Headers }) {
  const authCtx = await auth.api.getSession({
    headers: opts.headers,
  });

  if (!authCtx) {
    return {
      headers: opts.headers,
      session: null,
    };
  }

  return {
    headers: opts.headers,
    session: {
      session: authCtx.session,
      user: authCtx.user,
    },
  };
}

type Context = {} & Awaited<ReturnType<typeof createRPCContext>>;

export const o = os.$context<Context>();

export const or = o.use(dbMiddleware).use(authMiddleware);

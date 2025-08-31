import { os } from "@orpc/server";
import { dbMiddleware } from "@/server/middleware/db";
import { auth } from "@/lib/auth";

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

export const o = os.$context<Awaited<ReturnType<typeof createRPCContext>>>();

export const or = o.use(dbMiddleware);

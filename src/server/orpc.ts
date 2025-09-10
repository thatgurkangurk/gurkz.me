import { auth } from "@/lib/auth";
import { os } from "@orpc/server";
import { cookies, headers } from "next/headers";
import { dbMiddleware } from "./middleware/db";

const base = os
  .use(async ({ next }) =>
    next({
      context: {
        headers: await headers(),
        cookies: await cookies(),
        session: await auth.api.getSession({
          headers: await headers(),
        }),
      },
    })
  )
  .use(dbMiddleware);

export { base };

import { auth } from "@/lib/auth";
import { os } from "@orpc/server";
import { cookies, headers } from "next/headers";

const base = os.use(async ({ next }) =>
  next({
    context: {
      headers: await headers(),
      cookies: await cookies(),
      session: await auth.api.getSession({
        headers: await headers(),
      }),
    },
  })
);

export { base };

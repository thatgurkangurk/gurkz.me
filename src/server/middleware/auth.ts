import { os } from "@orpc/server";
import { ORPCError } from "@orpc/client";
import { Session } from "better-auth";
import { User } from "@/lib/auth";

export const requireAuthMiddleware = os
  .$context<{ session?: { session: Session; user: User } | null }>()
  .middleware(async ({ context, next }) => {
    const { session } = context;

    if (!session) throw new ORPCError("UNAUTHORIZED");

    return next({
      context: {
        session: session,
      },
    });
  });

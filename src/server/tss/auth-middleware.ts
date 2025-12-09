import { createMiddleware } from "@tanstack/react-start";
import { getServerSession } from "~/lib/session";

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await getServerSession();

  return next({
    context: {
      session: session,
    },
  });
});

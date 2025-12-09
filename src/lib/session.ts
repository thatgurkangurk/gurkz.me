import { createServerFn } from "@tanstack/react-start";
import { authClient, Session, User } from "./auth";
import { auth } from "~/server/auth";
import { getRequest } from "@tanstack/react-start/server";

export function useSession() {
  const { data: originalData, ...rest } = authClient.useSession();

  const correctData = originalData as {
    user: User;
    session: Session;
  } | null;

  return { data: correctData, ...rest };
}

export const getServerSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const session = await auth.api.getSession({
      headers: getRequest().headers,
    });

    return session as {
      user: User;
      session: Session;
    } | null;
  }
);

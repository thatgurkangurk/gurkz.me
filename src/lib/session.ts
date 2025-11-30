import { authClient } from "./auth";

export function useSession() {
  return authClient.useSession();
}

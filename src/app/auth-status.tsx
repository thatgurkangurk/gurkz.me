"use client";

import { authClient } from "@/lib/auth-client";

export function AuthStatus() {
  const { data } = authClient.useSession();

  if (data && data.user) {
    return (
      <div>
        <p>hi, {data.user.name}</p>
        <button onClick={() => authClient.signOut()}>log out</button>
      </div>
    );
  }

  return (
    <button
      onClick={() =>
        authClient.signIn.social({
          provider: "discord",
        })
      }
    >
      log in
    </button>
  );
}

"use client";

import { useSession } from "@/lib/hooks/session";

export function AuthStatus() {
  const { data, signOut, signIn } = useSession();

  if (data && data.user) {
    return (
      <div>
        <p>hi, {data.user.name}</p>
        <button onClick={() => signOut(null)}>log out</button>
      </div>
    );
  }

  return (
    <button
      onClick={() =>
        signIn({
          provider: "discord",
        })
      }
    >
      log in
    </button>
  );
}

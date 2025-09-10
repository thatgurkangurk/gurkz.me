"use client";

import { Button } from "./ui/button";
import { useSession } from "@/lib/hooks/session";

export function AuthStatus() {
  const { data, signIn, signOut } = useSession();

  return (
    <>
      {data?.user ? (
        <>
          <p className="whitespace-nowrap">hello, {data.user.name}</p>
          <Button variant={"link"} onClick={() => signOut(null)}>
            log out
          </Button>
        </>
      ) : (
        <Button
          variant={"link"}
          onClick={() =>
            signIn({
              provider: "discord",
            })
          }
        >
          log in
        </Button>
      )}
    </>
  );
}

import { useSession } from "~/lib/session";
import { Button } from "./ui/button";
import { authClient } from "~/lib/auth";

export function AuthStatus() {
  const { data } = useSession();

  return (
    <>
      {data?.user ? (
        <>
          <p className="whitespace-nowrap">hello, {data.user.name}</p>
          <Button variant={"link"} onClick={() => authClient.signOut()}>
            log out
          </Button>
        </>
      ) : (
        <Button
          variant={"link"}
          onClick={() =>
            authClient.signIn.social({
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

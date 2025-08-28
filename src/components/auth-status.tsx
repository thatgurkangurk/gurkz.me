import { orpc } from "@/lib/orpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";

export function AuthStatus() {
  const queryClient = useQueryClient();
  const { data } = useQuery(orpc.session.get.queryOptions());
  const { mutate: signIn } = useMutation(
    orpc.session.signIn.mutationOptions({
      onSuccess: (data) => {
        if (data.redirect && data.url) {
          location.replace(data.url);
        }
      },
    })
  );

  const { mutate: signOut } = useMutation(
    orpc.session.signOut.mutationOptions({
      onSuccess: async () => {
        await queryClient.refetchQueries({
          queryKey: orpc.session.key(),
        });
      },
    })
  );

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

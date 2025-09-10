import { orpc } from "@/lib/orpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useSession() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(orpc.session.get.queryOptions());

  const { mutate: signIn, isPending: signingIn } = useMutation(
    orpc.session.signIn.mutationOptions({
      onSuccess: (data) => {
        if (data.redirect && data.url) {
          location.replace(data.url);
        }
      },
    })
  );

  const { mutate: signOut, isPending: signingOut } = useMutation(
    orpc.session.signOut.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: orpc.session.key(),
        });
      },
    })
  );

  return { data, isLoading, signIn, signingIn, signOut, signingOut };
}

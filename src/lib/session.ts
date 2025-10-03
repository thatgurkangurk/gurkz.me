import { orpc } from "$lib/orpc";
import { createMutation, createQuery, useQueryClient } from "@tanstack/svelte-query";

export function useSession() {
	return createQuery(() => orpc.session.get.queryOptions());
}

export function useSignIn() {
	return createMutation(() =>
		orpc.session.signIn.mutationOptions({
			onSuccess: (data) => {
				if (data.redirect && data.url) {
					location.replace(data.url);
				}
			}
		})
	);
}

export function useSignOut() {
	const queryClient = useQueryClient();
	return createMutation(() =>
		orpc.session.signOut.mutationOptions({
			onSuccess: async () => {
				await queryClient.refetchQueries({
					queryKey: orpc.session.key()
				});
			}
		})
	);
}

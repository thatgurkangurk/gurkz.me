<script lang="ts">
	import { orpc } from "$lib/orpc";
	import { createQuery, useQueryClient, createMutation } from "@tanstack/svelte-query";

	const session = createQuery(() => orpc.session.get.queryOptions());
	const { mutateAsync: signOutAsync } = createMutation(() =>
		orpc.session.signOut.mutationOptions()
	);
	const { mutateAsync: signInAsync } = createMutation(() => ({
		...orpc.session.signIn.mutationOptions(),
		onSuccess(data) {
			if (data.redirect && data.url) {
				location.replace(data.url);
			}
		}
	}));
	const queryClient = useQueryClient();
</script>

<h1 class="text-3xl">welcome</h1>

{#if session.data}
	<div class="flex items-center-safe gap-2">
		<p>hello, {session.data.user.name}</p>
		<button
			onclick={async () => {
				await signOutAsync(null);
				await queryClient.refetchQueries({
					queryKey: orpc.session.get.key()
				});
			}}>log out</button
		>
	</div>
{:else}
	<button
		onclick={async () => {
			await signInAsync({
				provider: "discord"
			});
			await queryClient.refetchQueries({
				queryKey: orpc.session.get.key()
			});
		}}
	>
		log in
	</button>
{/if}

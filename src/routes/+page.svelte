<script lang="ts">
	import { authClient } from "$lib/auth-client";
	import { orpc } from "$lib/orpc";
	import { createQuery, useQueryClient } from "@tanstack/svelte-query";

	const session = createQuery(() => orpc.session.get.queryOptions());
	const queryClient = useQueryClient();
</script>

<h1 class="text-3xl">welcome</h1>

{#if session.data}
	<div class="flex items-center-safe gap-2">
		<p>hello, {session.data.user.name}</p>
		<button
			onclick={async () => {
				await authClient.signOut();
				await queryClient.refetchQueries({
					queryKey: orpc.session.get.key()
				});
			}}>log out</button
		>
	</div>
{:else}
	<button
		onclick={async () => {
			await authClient.signIn.social({
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

<script lang="ts">
	import { applyAction, enhance } from "$app/forms";
	import { createQuery, useQueryClient } from "@tanstack/svelte-query";
	import { orpc } from "$lib/orpc";

	const queryClient = useQueryClient();

	const query = createQuery(() => orpc.auth.getSession.queryOptions());
</script>

<h1 class="text-4xl">hello world</h1>
{#if query.data}
	<p>hello, {query.data.username}</p>
	<form
		use:enhance={async () => {
			return async ({ result }) => {
				await queryClient.invalidateQueries({
					queryKey: orpc.auth.getSession.key()
				});

				await applyAction(result);
			};
		}}
		method="POST"
		action="/auth?/logout"
	>
		<button type="submit">log out</button>
	</form>
{:else}
	<form use:enhance method="POST" action="/auth?/login">
		<button type="submit">log in</button>
	</form>
{/if}

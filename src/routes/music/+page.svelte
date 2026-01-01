<script lang="ts">
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();
</script>

<h1 class="text-3xl">music id list</h1>

{#each data.musicIds as musicId (musicId.id)}
	<div class="flex flex-row gap-2">
		<p>{musicId.name} - s/{musicId.robloxId}</p>
		<button onclick={() => navigator.clipboard.writeText(`s/${musicId.robloxId}`)}>copy</button>
	</div>
{/each}

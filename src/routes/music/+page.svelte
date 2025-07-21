<script lang="ts">
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();
</script>

<h1 class="text-3xl">music id list</h1>

{#each data.musicIds as musicId (musicId.id)}
	<p>{musicId.name} - {musicId.robloxId}</p>
{/each}

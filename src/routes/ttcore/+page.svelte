<script lang="ts">
	import { resolve } from "$app/paths";
	import { listVideos } from "$lib/api/ttcore/videos.remote";

	import { Button } from "$lib/components/ui/button/index.js";

	const videos = $derived(await listVideos());

	const openVideos = $derived.by(() => videos.filter((v) => v.submissionsOpen));
	const closedVideos = $derived.by(() => videos.filter((v) => !v.submissionsOpen));
</script>

<h1 class="text-3xl font-bold tracking-tight md:text-4xl">traitor town core</h1>

<p class="font-bold">here are all the current open submissions:</p>

<div class="grid w-fit grid-cols-1 gap-3">
	{#each openVideos as video (video.id)}
		<Button
			href={resolve("/ttcore/submit/[videoId]", {
				videoId: video.id
			})}>{video.title}</Button
		>
	{:else}
		<p class="font-bold">no clip submissions are open at the moment !</p>
	{/each}
</div>

<br />

{#if closedVideos.length > 0}
	<p class="font-bold">here are the submissions that are closed:</p>
	<p class="pb-2 text-gray-400 italic">you can use this to see who submitted to them</p>

	<div class="grid w-fit grid-cols-1 gap-3">
		{#each closedVideos as video (video.id)}
			<Button
				href={resolve("/ttcore/submit/[videoId]", {
					videoId: video.id
				})}>{video.title}</Button
			>
		{/each}
	</div>
{/if}

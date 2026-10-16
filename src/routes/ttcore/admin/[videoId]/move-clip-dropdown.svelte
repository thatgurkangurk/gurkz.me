<script lang="ts">
	import { getVideos } from "#lib/api/ttcore/videos.remote.js";
	import { buttonVariants } from "#lib/components/ui/button/index.js";
	import * as DropdownMenu from "#lib/components/ui/dropdown-menu/index.js";
	import * as AlertDialog from "#lib/components/ui/alert-dialog/index.js";
	import type { Clip } from "#lib/types/clip.js";
	import { Move, Loader } from "@lucide/svelte";
	import { createMutation } from "@tanstack/svelte-query";
	import { moveClipMutation } from "./query.js";

	type Props = {
		clip: Clip;
	};

	let { clip }: Props = $props();

	const videos = $derived(await getVideos());
	const availableVideos = $derived(
		videos.filter((video) => video.submissionsOpen && video.id !== clip.videoId)
	);

	type Video = (typeof videos)[number];

	let alertOpen = $state(false);
	let selectedVideo = $state<Video | null>(null);

	const mutation = createMutation(() => moveClipMutation());

	function handleSelect(video: Video) {
		selectedVideo = video;
		alertOpen = true;
	}

	async function handleConfirm() {
		if (!selectedVideo) return;

		await mutation.mutateAsync({
			clip: clip,
			newVideoId: selectedVideo.id
		});

		alertOpen = false;
		selectedVideo = null;
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class={buttonVariants({ variant: "outline", size: "icon" })}>
		<Move />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end" class="w-56">
		<DropdownMenu.Group>
			<DropdownMenu.Label>moving {clip.title}</DropdownMenu.Label>
			{#each availableVideos as video (video.id)}
				{#if video.submissionsOpen}
					<DropdownMenu.Item onclick={() => handleSelect(video)}>{video.title}</DropdownMenu.Item>
				{/if}
			{/each}
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<AlertDialog.Root bind:open={alertOpen}>
	<AlertDialog.Content size="sm">
		<AlertDialog.Header>
			<div class="relative mb-3 aspect-video w-full overflow-hidden rounded-lg bg-muted">
				<!-- svelte-ignore a11y_media_has_caption -->
				<video
					class="h-full w-full object-cover"
					src={clip.url}
					poster={`/api/ttcore/clips/${clip.id}/thumbnail`}
					controls
					preload="none"
				></video>
			</div>
			<AlertDialog.Title class="text-left">confirm move</AlertDialog.Title>
			<AlertDialog.Description class="text-left">
				are you sure you want to move this clip to <strong class="font-semibold text-foreground"
					>{selectedVideo?.title}</strong
				>?
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel disabled={mutation.isPending} onclick={() => (selectedVideo = null)}>
				cancel
			</AlertDialog.Cancel>
			<AlertDialog.Action disabled={mutation.isPending} onclick={handleConfirm}>
				{#if mutation.isPending}
					<Loader class="mr-2 h-4 w-4 animate-spin" />
				{/if}
				move it
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

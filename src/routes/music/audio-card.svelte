<script lang="ts">
	import type { User } from "lucia";
	import * as Card from "$lib/components/ui/card";
	import ClipboardCopyButton from "$lib/components/clipboard-copy-button.svelte";
	import { Button } from "$lib/components/ui/button";
	import { enhance } from "$app/forms";
	import { onMount } from "svelte";

	export let user: User | null;
	export let userIsAdmin: boolean;
	export let id: {
		id: string;
		name: string;
		robloxId: string;
		ownerUsername: string;
		ownerId: string;
	};

	let audio: HTMLAudioElement;
	let buttonText: string = "play";
	let isPlaying: boolean = false;

	onMount(() => {
		audio.addEventListener("play", () => {
			isPlaying = true;
			buttonText = "pause";
		});

		audio.addEventListener("pause", () => {
			isPlaying = false;
			buttonText = "play";
		});
	});
</script>

<Card.Root class="w-full h-full">
	<Card.Header>
		<Card.Title class="text-xl">{id.name}</Card.Title>
	</Card.Header>
	<Card.Content class="flex items-center text-xl">
		<span>{id.robloxId}</span>
		<ClipboardCopyButton contentToCopy={id.robloxId} />
	</Card.Content>
	<Card.Footer class="grid grid-cols-1">
		<audio src={`https://api.hyra.io/audio/${id.robloxId}`} bind:this={audio} />
		<Button
			on:click={() => {
				if (isPlaying) {
					audio.pause();
					audio.currentTime = 0;
					return;
				}

				audio.currentTime = 0;
				audio.play();
			}}>{buttonText}</Button
		>
		<span>Created by: {id.ownerUsername}</span>
		{#if user}
			{#if id.ownerId === user.id || userIsAdmin}
				<form action="?/delete" method="post" use:enhance>
					<input type="hidden" name="id" value={id.id} />
					<Button type="submit" variant="destructive">delete</Button>
				</form>
			{/if}
		{/if}
	</Card.Footer>
</Card.Root>

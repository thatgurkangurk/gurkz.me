<script lang="ts">
	import type { User } from "lucia";
	import * as Card from "$lib/components/ui/card";
	import ClipboardCopyButton from "$lib/components/clipboard-copy-button.svelte";
	import { Button } from "$lib/components/ui/button";
	import { enhance } from "$app/forms";
	import { createQuery } from "@tanstack/svelte-query";
	import { api } from "$lib/api";
	import { Skeleton } from "$lib/components/ui/skeleton";
	import { LoaderCircle } from "lucide-svelte";
	import { onMount } from "svelte";
	import { browser } from "$app/environment";

	export let user: User | null;
	export let userIsAdmin: boolean;
	export let id: string;

	let audio: HTMLAudioElement;
	let buttonText: string = "play";
	let isPlaying: boolean = false;

	const query = createQuery({
		queryKey: ["music_id", id],
		queryFn: () => api().getMusicId(id)
	});
</script>

{#if $query.isLoading}
	<Card.Root class="w-full h-full">
		<Card.Header>
			<Card.Title class="text-xl pt-1">
				<Skeleton class="h-6 w-2 sm:w-48 md:w-48 lg:w-60" />
			</Card.Title>
		</Card.Header>
		<Card.Content class="flex items-center text-xl gap-2 pt-3">
			<Skeleton class="h-6 w-2 sm:w-32 md:w-32 lg:w-48" />
			<Skeleton class="h-6 w-6" />
		</Card.Content>
		<Card.Footer class="grid grid-cols-1 gap-1">
			<Skeleton class="h-10" />
			<Skeleton class="h-6 w-[95%]" />
		</Card.Footer>
		<div class="p-2"><LoaderCircle class="h-6 w-6 animate-spin" /></div>
	</Card.Root>
{/if}

{#if $query.isError}
	<span>error: {$query.error.message}</span>
{/if}

{#if $query.isSuccess}
	<Card.Root class="w-full h-full">
		<Card.Header>
			<Card.Title class="text-xl">{$query.data.name}</Card.Title>
		</Card.Header>
		<Card.Content class="flex items-center text-xl">
			<span>{$query.data.robloxId}</span>
			<ClipboardCopyButton contentToCopy={$query.data.robloxId} />
		</Card.Content>
		<Card.Footer class="grid grid-cols-1">
			<audio
				src={`https://api.hyra.io/audio/${$query.data.robloxId}`}
				bind:this={audio}
				on:play={() => {
					isPlaying = true;
					buttonText = "pause";
				}}
				on:pause={() => {
					isPlaying = false;
					buttonText = "play";
				}}
			/>
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
			<span>Created by: {$query.data.ownerUsername}</span>
			{#if user}
				{#if $query.data.ownerId === user.id || userIsAdmin}
					<form action="?/delete" method="post" use:enhance>
						<input type="hidden" name="id" value={$query.data.id} />
						<Button type="submit" variant="destructive">delete</Button>
					</form>
				{/if}
			{/if}
		</Card.Footer>
	</Card.Root>
{/if}

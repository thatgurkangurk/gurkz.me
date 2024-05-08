<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import ClipboardCopyButton from "$lib/components/clipboard-copy-button.svelte";
	import { Button } from "$lib/components/ui/button";
	import { enhance } from "$app/forms";
	import { createQuery, useQueryClient } from "@tanstack/svelte-query";
	import { api } from "$lib/api";
	import { Skeleton } from "$lib/components/ui/skeleton";
	import { LoaderCircle } from "lucide-svelte";
	import type { User } from "$lib/user/types";
	import { toast } from "svelte-sonner";

	export let user: User | null;
	export let userIsAdmin: boolean;
	export let id: string;

	let audio: HTMLAudioElement;
	let buttonText: string = "play";
	let isPlaying: boolean = false;
	let queryClient = useQueryClient();

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
			<span>{$query.data.roblox_id}</span>
			<ClipboardCopyButton contentToCopy={$query.data.roblox_id} />
		</Card.Content>
		<Card.Footer class="grid grid-cols-1">
			<audio
				src={`https://api.hyra.io/audio/${$query.data.roblox_id}`}
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
			<span>Created by: {$query.data.expand.owner.username}</span>
			{#if user}
				{#if $query.data.expand.owner.id === user.id || userIsAdmin}
					<form
						action="?/delete"
						method="post"
						use:enhance={() => {
							return async ({ update, result }) => {
								if (result) {
									if (result.status === 200) {
										queryClient.invalidateQueries({ queryKey: ["music_ids"] });
										toast.success("success", {
											description: "successfully deleted the music id"
										});

										return;
									}

									if (result.status === 403) {
										toast.error("error", {
											description: "you do not have permission to do that"
										});
										return;
									}

									toast.error("error", {
										description: "something unexpected went wrong"
									});
									return;
								}
								await update();
							};
						}}
					>
						<input type="hidden" name="id" value={$query.data.id} />
						<Button type="submit" variant="destructive">delete</Button>
					</form>
				{/if}
			{/if}
		</Card.Footer>
	</Card.Root>
{/if}

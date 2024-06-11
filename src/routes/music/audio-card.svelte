<script lang="ts">
	import ClipboardCopyButton from "$lib/components/clipboard-copy-button.svelte";
	import * as Card from "$lib/components/ui/card";
	import type { MusicId } from "$lib/music-id/type";
	import { trpc } from "$lib/trpc/client";
	import type { User } from "$lib/user/types";
	import { LoaderCircle } from "lucide-svelte";
	import { toast } from "svelte-sonner";
	import MusicIdAudioPlayer from "./music-id-audio-player.svelte";
	import { useQueryClient } from "@tanstack/svelte-query";
	import { Button } from "$lib/components/ui/button";

	export let musicId: Omit<MusicId, "createdBy" | "created">;
	export let user: User | null;
	export let userIsAdmin: boolean;

	let toastId: number | string = "";

	const api = trpc();
	const queryClient = useQueryClient();

	const deleteMusicId = api.music.deleteMusicId.createMutation({
		onError: () => {
			toast.dismiss(toastId);
			toast.error("something went wrong while deleting the id");
		},
		onSuccess: () => {
			toast.dismiss(toastId);
			toast.success("deleted");
			queryClient.removeQueries({
				queryKey: api.music.getMusicId.getQueryKey({
					id: musicId.id
				})
			});
			queryClient.refetchQueries({
				queryKey: [["music"]]
			});
		}
	});

	const query = api.music.getMusicId.createQuery({
		id: musicId.id
	});
</script>

<Card.Root class="w-full h-full">
	<Card.Header>
		<Card.Title class="text-xl">{musicId.name}</Card.Title>
	</Card.Header>
	<Card.Content class="flex items-center text-xl">
		<span>{musicId.robloxId}</span>
		<ClipboardCopyButton contentToCopy={musicId.robloxId} />
	</Card.Content>
	<Card.Footer class="grid grid-cols-1">
		<MusicIdAudioPlayer robloxId={musicId.robloxId} />
		<span>Created by: {$query.data?.owner.username}</span>
		{#if user}
			{#if musicId.createdById === user.id || userIsAdmin}
				<div>
					<Button
						on:click={(e) => {
							e.preventDefault();
							$deleteMusicId.mutate({
								id: musicId.id
							});
						}}
						variant="destructive"
						disabled={$deleteMusicId.isPending}
						>{#if $deleteMusicId.isPending}
							<LoaderCircle class="h-6 w-6 animate-spin" />
						{/if} delete</Button
					>
				</div>
			{/if}
		{/if}
	</Card.Footer>
</Card.Root>

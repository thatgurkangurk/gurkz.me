<script lang="ts">
	import {
		Card,
		CardContent,
		CardFooter,
		CardHeader,
		CardTitle
	} from "$lib/components/ui/card/index.js";
	import type { MusicIdWithCreator } from "$lib/server/db/schema/music";
	import { SquareArrowOutUpRight } from "@lucide/svelte";
	import FormattedId from "./formatted-id.svelte";
	import { Button } from "$lib/components/ui/button";
	import { confirmDelete } from "$lib/components/ui/confirm-delete-dialog/index.js";
	import { useSession } from "$lib/session.svelte";
	import { deleteMusicId } from "$lib/api/music.remote";
	import { invalidateAll } from "$app/navigation";

	type Props = {
		musicId: MusicIdWithCreator;
	};

	const dateFormat = new Intl.DateTimeFormat("en-GB", {
		dateStyle: "long"
	});

	let { musicId }: Props = $props();

	const session = useSession();

	const canManage = $derived.by(() => {
		const user = session.current?.user;
		if (!user) return false;

		return (
			musicId.createdById === user.id || user.permissions?.includes("MANAGE_MUSIC_IDS") === true
		);
	});
</script>

<Card class="h-full w-full">
	<CardHeader class="flex items-center gap-2">
		<CardTitle class="text-xl">{musicId.name}</CardTitle>
		<Button
			size="icon"
			variant="ghost"
			href="https://create.roblox.com/store/asset/{musicId.robloxId}/"
			target="_blank"
			rel="noopener noreferrer"
		>
			<SquareArrowOutUpRight />
		</Button>
	</CardHeader>

	<CardContent>
		<div class="flex items-center gap-2 text-xl">
			<FormattedId robloxId={musicId.robloxId} />
		</div>
	</CardContent>
	<CardFooter class="grid grid-cols-1 gap-1">
		<div class="flex flex-row gap-2">
			{#if canManage}
				<Button
					variant="destructive"
					onclick={() => {
						confirmDelete({
							title: `delete "${musicId.name}"?`,
							description: "are you sure you want to delete this music id?",
							onConfirm: async () => {
								await deleteMusicId({
									id: musicId.id
								});

								await invalidateAll();
							}
						});
					}}>delete</Button
				>
			{/if}
			<!-- delete music card -->
		</div>
		<p>
			created by <span>{musicId.creator.name}</span> on{" "}
			<span class="whitespace-nowrap">
				{dateFormat.format(musicId.created)}
			</span>
		</p>
	</CardFooter>
</Card>

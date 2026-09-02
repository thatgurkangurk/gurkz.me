<script lang="ts">
	import {
		Card,
		CardContent,
		CardFooter,
		CardHeader,
		CardTitle
	} from "#lib/components/ui/card/index.js";
	import type { MusicIdWithCreator } from "#lib/server/db/schema.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import { confirmDelete } from "#lib/components/ui/confirm-delete-dialog/index.js";
	import { deleteMusicId } from "#lib/api/music.remote.js";
	import { Badge } from "#lib/components/ui/badge/index.js";
	import { SquareArrowOutUpRight } from "@lucide/svelte";
	import { getIdFormat } from "../context.svelte";
	import { CopyButton } from "#lib/components/ui/copy-button/index.js";
	import { Skeleton } from "#lib/components/ui/skeleton/index.js";
	import CheckWithPending from "#lib/components/check-with-pending.svelte";

	type Props = {
		musicId: MusicIdWithCreator;
	};

	const dateFormat = new Intl.DateTimeFormat("en-GB", {
		dateStyle: "long"
	});

	let { musicId }: Props = $props();

	const state = getIdFormat();

	const formattedId = $derived.by(() => state.format(musicId.robloxId));
</script>

<Card class="flex h-full w-full flex-col">
	<CardHeader>
		<div class="flex items-center gap-2">
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
		</div>

		{#if musicId.tags.length > 0}
			<div class="flex gap-2 pt-2">
				{#each musicId.tags as tag}
					<Badge>{tag}</Badge>
				{/each}
			</div>
		{/if}
	</CardHeader>

	<CardContent class="flex-1">
		<div class="flex items-center gap-2 text-xl">
			<span>{formattedId}</span>
			<CopyButton text={formattedId} variant={"outline"} />
		</div>
	</CardContent>
	<CardFooter class="grid grid-cols-1 gap-1">
		<div class="flex min-h-9 items-center justify-start">
			<CheckWithPending path="musicId.delete" data={musicId}>
				{#snippet pending()}
					<Skeleton class="h-9 w-18 rounded-md" />
				{/snippet}

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
							}
						});
					}}>delete</Button
				>
			</CheckWithPending>
		</div>
		<p>
			created by <span>{musicId.creator.name}</span> on{" "}
			<span class="whitespace-nowrap">
				{dateFormat.format(musicId.createdAt)}
			</span>
		</p>
	</CardFooter>
</Card>

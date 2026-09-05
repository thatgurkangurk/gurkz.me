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
	import { Avatar, AvatarFallback, AvatarImage } from "#lib/components/ui/avatar/index.js";

	type Props = {
		musicId: MusicIdWithCreator;
		onDelete?: (id: string) => void;
	};

	const dateFormat = new Intl.DateTimeFormat("en-GB", {
		dateStyle: "long"
	});

	let { musicId, onDelete }: Props = $props();

	const state = getIdFormat();

	const formattedId = $derived.by(() => state.format(musicId.robloxId));

	const initials = $derived(
		musicId.creator.name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2)
	);
</script>

<Card class="flex h-full w-full flex-col justify-between overflow-hidden">
	<CardHeader>
		<div class="flex items-start justify-between gap-2">
			<CardTitle class="line-clamp-1 text-lg font-semibold">
				{musicId.name}
			</CardTitle>
			<Button
				size="icon"
				variant="ghost"
				class="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
				href="https://create.roblox.com/store/asset/{musicId.robloxId}/"
				target="_blank"
				rel="noopener noreferrer"
			>
				<SquareArrowOutUpRight class="h-4 w-4" />
			</Button>
		</div>

		{#if musicId.tags.length > 0}
			<div class="flex flex-wrap gap-1.5 pt-1">
				{#each musicId.tags as tag}
					<Badge variant="secondary" class="text-xs">{tag}</Badge>
				{/each}
			</div>
		{/if}
	</CardHeader>

	<CardContent class="py-1">
		<div class="flex items-center justify-between rounded-lg border p-2.5">
			<span class="font-mono text-base font-semibold tracking-wide">
				{formattedId}
			</span>
			<CopyButton text={formattedId} variant="ghost" size="sm" />
		</div>
	</CardContent>

	<CardFooter class="flex min-h-14 items-center justify-between border-t px-6 py-2.5">
		<div class="flex items-center gap-2.5">
			<Avatar class="h-7 w-7 border">
				<AvatarImage src={musicId.creator.image} alt={musicId.creator.name} />
				<AvatarFallback class="text-[10px]">{initials}</AvatarFallback>
			</Avatar>
			<div class="flex flex-col text-xs leading-tight">
				<span class="font-medium text-foreground">
					{musicId.creator.name}
				</span>
				<span class="text-[11px] text-muted-foreground">
					{dateFormat.format(musicId.createdAt)}
				</span>
			</div>
		</div>

		<div class="flex h-8 items-center">
			<CheckWithPending path="musicId.delete" data={musicId}>
				{#snippet pending()}
					<Skeleton class="h-8 w-16 rounded-md" />
				{/snippet}

				<Button
					size="sm"
					variant="destructive"
					onclick={() => {
						confirmDelete({
							title: `delete "${musicId.name}"?`,
							description: "are you sure you want to delete this music id?",
							onConfirm: async () => {
								await deleteMusicId({
									id: musicId.id
								});
								onDelete?.(musicId.id);
							}
						});
					}}
				>
					delete
				</Button>
			</CheckWithPending>
		</div>
	</CardFooter>
</Card>

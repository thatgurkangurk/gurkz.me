<script lang="ts">
	import FormatSelector from "./components/format-selector.svelte";
	import MusicCard from "./components/music-card.svelte";
	import NewMusicIdForm from "./components/new-music-id-form.svelte";
	import { Input } from "#lib/components/ui/input/index.js";
	import { Label } from "#lib/components/ui/label/index.js";
	import { ConfirmDeleteDialog } from "#lib/components/ui/confirm-delete-dialog/index.js";
	import * as Empty from "#lib/components/ui/empty/index.js";
	import { scope } from "#lib/utils/scope.js";
	import { getMusicIds } from "#lib/api/music.remote.js";
	import { Check } from "#lib/permix.js";
	import { untrack } from "svelte";
	import { Loader, Search, SearchAlert } from "@lucide/svelte";
	import { Debounced, useIntersectionObserver, watch } from "runed";

	const LIMIT = 20;
	const initialItems = await getMusicIds({ page: 1, limit: LIMIT, search: "" });

	let searchFilter = $state("");
	const debouncedSearchFilter = new Debounced(() => searchFilter, 500);

	let musicIds = $state(initialItems);
	let lastBatchLength = $state(initialItems.length);
	let page = $state(2);

	let isFetchingMore = $state(false);
	let isFetchingNewSearch = $state(false);

	let isSearching = $derived(searchFilter !== debouncedSearchFilter.current || isFetchingNewSearch);
	let hasMore = $derived(lastBatchLength === LIMIT);

	let loadMoreAnchor = $state<HTMLElement | null>(null);

	useIntersectionObserver(
		() => loadMoreAnchor,
		([entry]) => {
			if (entry?.isIntersecting) {
				untrack(() => loadMore());
			}
		}
	);

	async function loadMore() {
		if (isFetchingMore || !hasMore || isSearching) return;
		isFetchingMore = true;

		try {
			const newItems = await getMusicIds({
				page,
				limit: LIMIT,
				search: debouncedSearchFilter.current
			});

			musicIds = [...musicIds, ...newItems];
			lastBatchLength = newItems.length;
			page += 1;
		} finally {
			isFetchingMore = false;
		}
	}

	watch(
		() => debouncedSearchFilter.current,
		(currentSearch) => {
			(async () => {
				isFetchingNewSearch = true;

				try {
					const newItems = await getMusicIds({ page: 1, limit: LIMIT, search: currentSearch });
					musicIds = newItems;
					lastBatchLength = newItems.length;
					page = 2;
				} finally {
					isFetchingNewSearch = false;
				}
			})();
		},
		{ lazy: true }
	);

	let id = $props.id();
</script>

<h1 class="pb-2 text-3xl font-bold tracking-tight md:text-4xl">music id list</h1>

<Check path="musicId.create">
	<NewMusicIdForm />
	<br />
</Check>

<FormatSelector />
<ConfirmDeleteDialog />

<div class="grid max-w-sm grid-cols-1 gap-2 pt-4">
	<div class="space-y-2">
		<Label for={scope(id, "search_filter")}>search</Label>
		<div class="relative">
			<Search class="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />

			<Input
				id={scope(id, "search_filter")}
				bind:value={searchFilter}
				placeholder="search music ids"
				class="px-9"
			/>

			{#if isSearching}
				<div class="absolute top-2.5 right-3 text-muted-foreground">
					<Loader class="h-4 w-4 animate-spin" />
				</div>
			{/if}
		</div>
	</div>
</div>

<div
	class={[
		"grid w-full grid-cols-1 place-items-center gap-4 py-6 transition-opacity duration-300 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5",
		isSearching && "opacity-50"
	]}
>
	{#each musicIds as musicId (musicId.id)}
		<MusicCard
			{musicId}
			onDelete={(deletedId) => {
				musicIds = musicIds.filter((item) => item.id !== deletedId);
			}}
		/>
	{/each}

	{#if musicIds.length === 0 && !isSearching}
		<Empty.Root>
			<Empty.Header>
				<Empty.Media variant="icon">
					<SearchAlert />
				</Empty.Media>
				<Empty.Title>no music ids were found</Empty.Title>
				<Empty.Description>try searching for something else</Empty.Description>
			</Empty.Header>
		</Empty.Root>
	{/if}
</div>

{#if hasMore && !isSearching}
	<div bind:this={loadMoreAnchor} class="flex w-full items-center justify-center py-10">
		{#if isFetchingMore}
			<div
				class="flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm text-muted-foreground shadow-sm"
			>
				<Loader class="h-4 w-4 animate-spin text-primary" />
				loading
			</div>
		{/if}
	</div>
{/if}

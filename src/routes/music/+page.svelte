<script lang="ts">
	import FormatSelector from "./components/format-selector.svelte";
	import MusicCard from "./components/music-card.svelte";
	import NewMusicIdForm from "./components/new-music-id-form.svelte";
	import { Input } from "#lib/components/ui/input/index.js";
	import { Label } from "#lib/components/ui/label/index.js";
	import { ConfirmDeleteDialog } from "#lib/components/ui/confirm-delete-dialog/index.js";
	import * as Empty from "#lib/components/ui/empty/index.js";
	import { scope } from "#lib/utils/scope.js";
	import { Check } from "#lib/permix.svelte.js";
	import { Loader, Search, SearchAlert } from "@lucide/svelte";
	import { Debounced, useIntersectionObserver } from "runed";
	import { createInfiniteQuery, useQueryClient, type InfiniteData } from "@tanstack/svelte-query";
	import { musicIdsInfiniteQueryOptions } from "./query.js";
	import type { getMusicIds } from "#lib/api/music.remote.js";

	let searchFilter = $state("");
	const debouncedSearchFilter = new Debounced(() => searchFilter, 500);

	const queryClient = useQueryClient();

	const query = createInfiniteQuery(() =>
		musicIdsInfiniteQueryOptions(debouncedSearchFilter.current)
	);

	let musicIds = $derived(query.data?.pages.flat() ?? []);

	let isSearching = $derived(
		searchFilter !== debouncedSearchFilter.current ||
			(query.isFetching && !query.isFetchingNextPage)
	);

	let loadMoreAnchor = $state<HTMLElement | null>(null);

	useIntersectionObserver(
		() => loadMoreAnchor,
		([entry]) => {
			if (entry?.isIntersecting && query.hasNextPage && !query.isFetchingNextPage) {
				query.fetchNextPage();
			}
		}
	);

	type MusicPage = Awaited<ReturnType<typeof getMusicIds>>;

	type MusicCache = InfiniteData<MusicPage>;

	function handleDelete(deletedId: string) {
		const options = musicIdsInfiniteQueryOptions(debouncedSearchFilter.current);

		queryClient.setQueryData<MusicCache>(options.queryKey, (oldData) => {
			if (!oldData) return oldData;

			return {
				...oldData,
				pages: oldData.pages.map((page) => page.filter((item) => item.id !== deletedId))
			};
		});
	}

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

			{#if isSearching || (query.isLoading && !query.data)}
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
		<MusicCard {musicId} onDelete={handleDelete} />
	{/each}

	{#if musicIds.length === 0 && !query.isLoading && !isSearching}
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

{#if query.hasNextPage && !isSearching}
	<div bind:this={loadMoreAnchor} class="flex w-full items-center justify-center py-10">
		{#if query.isFetchingNextPage}
			<div
				class="flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm text-muted-foreground shadow-sm"
			>
				<Loader class="h-4 w-4 animate-spin text-primary" />
				loading
			</div>
		{/if}
	</div>
{/if}

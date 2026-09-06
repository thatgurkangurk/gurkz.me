<script lang="ts">
	import FormatSelector from "./components/format-selector.svelte";
	import MusicCard from "./components/music-card.svelte";
	import NewMusicIdForm from "./components/new-music-id-form.svelte";
	import { ConfirmDeleteDialog } from "#lib/components/ui/confirm-delete-dialog/index.js";
	import * as Empty from "#lib/components/ui/empty/index.js";
	import { scope } from "#lib/utils/scope.js";
	import { Check } from "#lib/permix.svelte.js";
	import { Loader, SearchAlert } from "@lucide/svelte";
	import { Debounced, useIntersectionObserver } from "runed";
	import { createInfiniteQuery, useQueryClient, type InfiniteData } from "@tanstack/svelte-query";
	import { musicIdsInfiniteQueryOptions } from "./query.js";
	import type { getMusicIds } from "#lib/api/music.remote.js";
	import Search from "#lib/components/search.svelte";

	let searchFilter = $state("");
	const debouncedSearchFilter = new Debounced(() => searchFilter, 500);

	const queryClient = useQueryClient();

	const query = createInfiniteQuery(() =>
		musicIdsInfiniteQueryOptions(debouncedSearchFilter.current)
	);

	let musicIds = $derived(query.data?.pages.flat() ?? []);

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

	let isSearching = $derived(
		debouncedSearchFilter.pending || (query.isFetching && !query.isFetchingNextPage)
	);
	let id = $props.id();
</script>

<div class="space-y-8 pb-12">
	<div class="space-y-4">
		<h1 class="text-3xl font-bold tracking-tight md:text-4xl">music id list</h1>

		<Check path="musicId.create">
			<div class="pt-2">
				<NewMusicIdForm />
			</div>
		</Check>
	</div>

	<div class="flex flex-col gap-6 pt-2">
		<FormatSelector />
		<ConfirmDeleteDialog />

		<Search id={scope(id, "search_filter")} bind:value={searchFilter} {isSearching} />
	</div>

	<div class="w-full pt-4">
		<div
			class={[
				"grid w-full grid-cols-1 gap-8 transition-all duration-300 ease-out sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
				isSearching ? "pointer-events-none scale-[0.99] opacity-40" : "scale-100 opacity-100"
			]}
		>
			{#each musicIds as musicId (musicId.id)}
				<div class="transition-transform duration-200 ease-out hover:-translate-y-1.5">
					<MusicCard {musicId} onDelete={handleDelete} />
				</div>
			{/each}
		</div>

		{#if musicIds.length === 0 && !query.isLoading && !isSearching}
			<div class="py-16">
				<Empty.Root class="py-12">
					<Empty.Header>
						<Empty.Media variant="icon">
							<SearchAlert class="h-10 w-10" />
						</Empty.Media>
						<Empty.Title class="text-lg">no music ids were found</Empty.Title>
						<Empty.Description class="text-sm">try searching for something else</Empty.Description>
					</Empty.Header>
				</Empty.Root>
			</div>
		{/if}

		{#if query.hasNextPage && !isSearching}
			<div bind:this={loadMoreAnchor} class="flex w-full items-center justify-center py-20">
				{#if query.isFetchingNextPage}
					<div
						class="flex animate-in items-center gap-2.5 rounded-full border bg-background/80 px-5 py-2.5 text-sm text-muted-foreground shadow-xs backdrop-blur-md duration-200 zoom-in-95 fade-in"
					>
						<Loader class="h-4 w-4 animate-spin text-primary" />
						<span>loading more...</span>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<script lang="ts">
	import { getMusicIds } from "#lib/api/music.remote.js";
	import CheckWithPending from "#lib/components/check-with-pending.svelte";
	import { Button } from "#lib/components/ui/button/index.js";
	import { ConfirmDeleteDialog } from "#lib/components/ui/confirm-delete-dialog/index.js";
	import * as Empty from "#lib/components/ui/empty/index.js";
	import { Input } from "#lib/components/ui/input/index.js";
	import { Label } from "#lib/components/ui/label/index.js";
	import type { MusicIdWithCreator } from "#lib/server/db/schema.js";
	import { scope } from "#lib/utils/scope.js";

	import { ChevronLeft, ChevronRight, Loader, Search, SearchAlert, X } from "@lucide/svelte";
	import { Debounced, watch } from "runed";
	import { useSearchParams } from "runed/kit";
	import { fade, scale } from "svelte/transition";

	import type { PageProps } from "./$types.js";
	import FormatSelector from "./components/format-selector.svelte";
	import MusicCard from "./components/music-card.svelte";
	import NewMusicIdForm from "./components/new-music-id-form.svelte";
	import { searchParamsSchema } from "./schemas.js";

	const LIMIT = 20;

	let { data }: PageProps = $props();

	$inspect(data.searchParams);

	const params = useSearchParams(searchParamsSchema, {
		pushHistory: false,
		noScroll: true,
		// svelte-ignore state_referenced_locally i only want the initial
		initial: $state.snapshot(data.searchParams)
	});

	const initialItems = await getMusicIds({
		page: params.page,
		limit: LIMIT,
		search: params.filter
	});

	let searchInput = $state(params.filter ?? "");
	const debouncedSearch = new Debounced(() => searchInput, 500);

	let musicIds = $state<MusicIdWithCreator[]>(initialItems);
	let isFetching = $state(false);

	let hasNextPage = $derived(musicIds.length === LIMIT);
	let hasPrevPage = $derived(params.page > 1);

	async function loadMusicData() {
		isFetching = true;
		try {
			const items = await getMusicIds({
				page: params.page,
				limit: LIMIT,
				search: params.filter
			});
			musicIds = items;
		} catch (error) {
			console.error("Failed to fetch music IDs:", error);
		} finally {
			isFetching = false;
		}
	}

	watch(
		() => debouncedSearch.current,
		(newQuery) => {
			if (newQuery !== params.filter) {
				params.filter = newQuery;
				params.page = 1;
			}
		}
	);

	watch(
		() => [params.page, params.filter] as const,
		([newPage], oldValues) => {
			loadMusicData();
			const oldPage = oldValues?.[0];
			if (oldPage !== undefined && newPage !== oldPage) {
				window.scrollTo({ top: 0, behavior: "smooth" });
			}
		},
		{ lazy: true }
	);

	function handlePrevPage() {
		if (!hasPrevPage) return;
		params.page -= 1;
	}

	function handleNextPage() {
		if (!hasNextPage) return;
		params.page += 1;
	}

	let id = $props.id();

	function handleCreate(newItem: MusicIdWithCreator) {
		musicIds = [newItem, ...musicIds];
	}

	function handleClearSearch() {
		searchInput = "";
	}
</script>

<h1 class="pb-2 text-3xl font-bold tracking-tight md:text-4xl">music id list</h1>

<CheckWithPending path="musicId.create">
	<NewMusicIdForm onCreate={handleCreate} />
	<br />
</CheckWithPending>

<ConfirmDeleteDialog />

<div class="flex flex-col gap-4 pt-4 sm:flex-row sm:items-end sm:justify-between">
	<div class="w-full max-w-sm space-y-2">
		<Label for={scope(id, "search_filter")}>search</Label>
		<div class="relative">
			<Search class="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />

			<Input
				id={scope(id, "search_filter")}
				bind:value={searchInput}
				placeholder="search..."
				class="px-9"
			/>

			{#if isFetching}
				<div
					class="absolute top-2.5 right-3 text-muted-foreground"
					transition:fade={{ duration: 150 }}
				>
					<Loader class="h-4 w-4 animate-spin" />
				</div>
			{:else if searchInput}
				<button
					type="button"
					onclick={handleClearSearch}
					class="absolute top-2.5 right-3 text-muted-foreground hover:text-foreground"
					aria-label="clear search"
					transition:fade={{ duration: 150 }}
				>
					<X class="h-4 w-4" />
				</button>
			{/if}
		</div>
	</div>

	<div class="flex w-full justify-start sm:w-auto sm:justify-end">
		<FormatSelector />
	</div>
</div>

{#if musicIds.length === 0 && !isFetching}
	<Empty.Root>
		<Empty.Header>
			<Empty.Media variant="icon">
				<SearchAlert />
			</Empty.Media>
			<Empty.Title>no music ids found</Empty.Title>
			<Empty.Description>
				{searchInput || params.filter
					? `no results for "${searchInput || params.filter}". try searching for something else.`
					: "create the first music id! (if you're seeing this something went HORRIBLY wrong)"}
			</Empty.Description>
		</Empty.Header>
	</Empty.Root>
{/if}

{#if musicIds.length > 0}
	<div
		class={[
			"grid w-full items-stretch gap-4 py-6 transition-opacity duration-300 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5",
			isFetching && "pointer-events-none opacity-50"
		]}
	>
		{#each musicIds as musicId, i (musicId.id)}
			<div
				class="flex h-full w-full"
				in:scale={{ duration: 200, start: 0.95, delay: Math.min(i * 30, 300) }}
				out:fade={{ duration: 150 }}
			>
				<MusicCard
					{musicId}
					onDelete={(deletedId) => {
						musicIds = musicIds.filter((item) => item.id !== deletedId);
					}}
				/>
			</div>
		{/each}
	</div>

	<div class="mt-6 flex items-center justify-between border-t pt-4 pb-8">
		<span class="text-sm text-muted-foreground">
			page {params.page}
		</span>
		<div class="flex items-center gap-2">
			<Button
				variant="outline"
				size="sm"
				disabled={!hasPrevPage || isFetching}
				onclick={handlePrevPage}
			>
				<ChevronLeft class="mr-1 h-4 w-4" />
				previous
			</Button>
			<Button
				variant="outline"
				size="sm"
				disabled={!hasNextPage || isFetching}
				onclick={handleNextPage}
			>
				next
				<ChevronRight class="ml-1 h-4 w-4" />
			</Button>
		</div>
	</div>
{/if}

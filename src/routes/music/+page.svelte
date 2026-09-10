<script lang="ts">
	import { getMusicIds } from "#lib/api/music.remote.js";
	import CheckWithPending from "#lib/components/check-with-pending.svelte";
	import { Button } from "#lib/components/ui/button/index.js";
	import { ConfirmDeleteDialog } from "#lib/components/ui/confirm-delete-dialog/index.js";
	import * as Empty from "#lib/components/ui/empty/index.js";
	import { Input } from "#lib/components/ui/input/index.js";
	import { Label } from "#lib/components/ui/label/index.js";
	import { scope } from "#lib/utils/scope.js";

	import { ChevronLeft, ChevronRight, Search, SearchAlert, X } from "@lucide/svelte";
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

	const params = useSearchParams(searchParamsSchema, {
		pushHistory: false,
		noScroll: true,
		// svelte-ignore state_referenced_locally
		initial: $state.snapshot(data.searchParams)
	});

	let searchInput = $state(params.filter ?? "");
	const debouncedSearch = new Debounced(() => searchInput, 500);

	const fetchPromise = $derived(
		getMusicIds({
			page: params.page,
			limit: LIMIT,
			search: params.filter
		})
	);

	let musicIds = $derived(await fetchPromise);

	let hasNextPage = $derived(musicIds.length === LIMIT);
	let hasPrevPage = $derived(params.page > 1);

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
		() => params.page,
		(newPage, oldPage) => {
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

	function handleClearSearch() {
		searchInput = "";
	}
</script>

<h1 class="pb-2 text-3xl font-bold tracking-tight md:text-4xl">music id list</h1>

<CheckWithPending path="musicId.create">
	<NewMusicIdForm search={params.filter} limit={20} currentPage={params.page} />
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

			{#if searchInput}
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

{#if musicIds.length === 0}
	<Empty.Root>
		<Empty.Header>
			<Empty.Media variant="icon">
				<SearchAlert />
			</Empty.Media>
			<Empty.Title>no music ids found</Empty.Title>
			<Empty.Description>
				{searchInput || params.filter
					? `no results for "${searchInput || params.filter}". try searching for something else.`
					: "create the first music id!"}
			</Empty.Description>
		</Empty.Header>
	</Empty.Root>
{:else}
	<div
		class="grid w-full items-stretch gap-4 py-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5"
	>
		{#each musicIds as musicId, i (musicId.id)}
			<div
				class="flex h-full w-full"
				in:scale={{ duration: 200, start: 0.95, delay: Math.min(i * 30, 300) }}
				out:fade={{ duration: 150 }}
			>
				<MusicCard search={params.filter} limit={20} currentPage={params.page} {musicId} />
			</div>
		{/each}
	</div>

	<div class="mt-6 flex items-center justify-between border-t pt-4 pb-8">
		<span class="text-sm text-muted-foreground">
			page {params.page}
		</span>
		<div class="flex items-center gap-2">
			<Button variant="outline" size="sm" disabled={!hasPrevPage} onclick={handlePrevPage}>
				<ChevronLeft class="mr-1 h-4 w-4" />
				previous
			</Button>
			<Button variant="outline" size="sm" disabled={!hasNextPage} onclick={handleNextPage}>
				next
				<ChevronRight class="ml-1 h-4 w-4" />
			</Button>
		</div>
	</div>
{/if}

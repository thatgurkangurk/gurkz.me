<script lang="ts">
	import { getMusicIds } from "#lib/api/music.remote.js";
	import CheckWithPending from "#lib/components/check-with-pending.svelte";
	import Search from "#lib/components/search.svelte";
	import { Button } from "#lib/components/ui/button/index.js";
	import { ConfirmDeleteDialog } from "#lib/components/ui/confirm-delete-dialog/index.js";
	import * as Empty from "#lib/components/ui/empty/index.js";
	import { scope } from "#lib/utils/scope.js";

	import { ChevronLeft, ChevronRight, Loader2, SearchAlert, X } from "@lucide/svelte";
	import { Debounced, watch } from "runed";
	import { useSearchParams } from "runed/kit";
	import { cubicOut } from "svelte/easing";
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

	const debouncedSearch = new Debounced(() => searchInput, 400);

	let musicIds = $derived(
		await getMusicIds({
			page: params.page,
			limit: LIMIT,
			search: params.filter
		})
	);

	let hasNextPage = $derived(musicIds.length === LIMIT);
	let hasPrevPage = $derived(params.page > 1);

	let isPending = $derived($effect.pending() > 0 || searchInput !== debouncedSearch.current);

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

	function subtleIn(_node: HTMLElement, { delay = 0, duration = 180 }) {
		return {
			delay,
			duration,
			easing: cubicOut,
			css: (t: number) => {
				const scale = 0.97 + t * 0.03;
				return `
					opacity: ${t};
					transform: scale(${scale});
				`;
			}
		};
	}
</script>

<h1 class="pb-2 text-3xl font-bold tracking-tight md:text-4xl">music id list</h1>

<CheckWithPending path="musicId.create">
	<NewMusicIdForm search={params.filter} limit={20} currentPage={params.page} />
	<br />
</CheckWithPending>

<ConfirmDeleteDialog />

<div class="flex flex-col gap-4 pt-4 sm:flex-row sm:items-end sm:justify-between">
	<Search
		id={scope(id, "search_input")}
		isSearching={isPending}
		bind:value={searchInput}
		label="search music ids"
	/>

	<div class="flex w-full justify-start sm:w-auto sm:justify-end">
		<FormatSelector />
	</div>
</div>

{#if musicIds.length === 0}
	<div in:fade={{ duration: 150 }}>
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
	</div>
{:else}
	<div
		class="grid w-full items-stretch gap-4 py-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 transition-opacity duration-200"
		class:opacity-50={isPending}
		class:pointer-events-none={isPending}
	>
		{#each musicIds as musicId, i (musicId.id)}
			<div class="flex h-full w-full" in:subtleIn={{ delay: Math.min(i * 20, 180), duration: 180 }}>
				<MusicCard search={params.filter} limit={20} currentPage={params.page} {musicId} />
			</div>
		{/each}
	</div>

	<div class="mt-6 flex items-center justify-between border-t pt-4 pb-8">
		<span class="text-sm font-mono text-muted-foreground">
			page {params.page}
		</span>
		<div class="flex items-center gap-2">
			<Button
				variant="outline"
				size="sm"
				disabled={!hasPrevPage || isPending}
				onclick={handlePrevPage}
			>
				<ChevronLeft class="mr-1 h-4 w-4" />
				previous
			</Button>
			<Button
				variant="outline"
				size="sm"
				disabled={!hasNextPage || isPending}
				onclick={handleNextPage}
			>
				next
				<ChevronRight class="ml-1 h-4 w-4" />
			</Button>
		</div>
	</div>
{/if}

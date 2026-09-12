<script lang="ts">
	import CheckWithPending from "#lib/components/check-with-pending.svelte";
	import Search from "#lib/components/search.svelte";
	import { Button } from "#lib/components/ui/button/index.js";
	import { ConfirmDeleteDialog } from "#lib/components/ui/confirm-delete-dialog/index.js";
	import * as Empty from "#lib/components/ui/empty/index.js";
	import { MusicIdListState } from "#lib/features/music/state.svelte.js";
	import { scope } from "#lib/utils/scope.js";

	import { resolve } from "$app/paths";
	import { ChevronLeft, ChevronRight, SearchAlert } from "@lucide/svelte";
	import { cubicOut } from "svelte/easing";
	import { fade } from "svelte/transition";

	import type { PageProps } from "./$types.js";
	import FormatSelector from "./components/format-selector.svelte";
	import MusicCard from "./components/music-card.svelte";
	import NewMusicIdForm from "./components/new-music-id-form.svelte";

	let { data }: PageProps = $props();

	// svelte-ignore state_referenced_locally
	const listState = new MusicIdListState(data.searchParams, 15);

	const musicIds = $derived(await listState.musicIds);

	const id = $props.id();

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

	function getPageUrl(pageOffset: number): string {
		const params = new URLSearchParams(listState.params.toURLSearchParams());
		const currentPage = listState.params.page ?? 1;
		params.set("page", String(currentPage + pageOffset));
		return `${resolve("/music")}?${params.toString()}`;
	}
</script>

<h1 class="pb-2 text-3xl font-bold tracking-tight md:text-4xl">music id list</h1>

<CheckWithPending path="musicId.create">
	<NewMusicIdForm {listState} />
	<br />
</CheckWithPending>

<ConfirmDeleteDialog />

<div class="flex flex-col gap-4 pt-4 sm:flex-row sm:items-end sm:justify-between">
	<Search
		id={scope(id, "search_input")}
		isSearching={listState.isPending}
		bind:value={listState.searchInput}
		label="search music ids"
	/>

	<div class="flex w-full justify-start sm:w-auto sm:justify-end">
		<FormatSelector />
	</div>
</div>

{#if musicIds.data.length === 0}
	<div in:fade={{ duration: 150 }}>
		<Empty.Root>
			<Empty.Header>
				<Empty.Media variant="icon">
					<SearchAlert />
				</Empty.Media>
				<Empty.Title>no music ids found</Empty.Title>
				<Empty.Description>
					{listState.searchInput || listState.params.filter
						? `no results for "${listState.searchInput || listState.params.filter}". try searching for something else.`
						: "create the first music id!"}
				</Empty.Description>
			</Empty.Header>
		</Empty.Root>
	</div>
{:else}
	<div
		class={[
			listState.isPending && "pointer-events-none opacity-50",
			"grid w-full grid-cols-1 items-stretch gap-4 py-6 transition-opacity duration-200 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
		]}
	>
		{#each musicIds.data as musicId, i (musicId.id)}
			<div class="flex h-full w-full" in:subtleIn={{ delay: Math.min(i * 20, 180), duration: 180 }}>
				<MusicCard {listState} {musicId} />
			</div>
		{/each}
	</div>

	<div class="mt-6 flex items-center justify-between border-t pt-4 pb-8">
		<span class="font-mono text-sm text-muted-foreground">
			page {listState.params.page}
		</span>
		<div class="flex items-center gap-2">
			<Button
				variant="outline"
				size="sm"
				aria-disabled={!musicIds.pagination.hasPrevPage || listState.isPending}
				class={!musicIds.pagination.hasPrevPage || listState.isPending
					? "pointer-events-none opacity-50"
					: ""}
				href={getPageUrl(-1)}
				onclick={(e) => {
					if (!musicIds.pagination.hasPrevPage || listState.isPending) e.preventDefault();
				}}
			>
				<ChevronLeft class="mr-1 h-4 w-4" />
				previous
			</Button>

			<Button
				variant="outline"
				size="sm"
				disabled={!musicIds.pagination.hasNextPage || listState.isPending}
				class={!musicIds.pagination.hasNextPage || listState.isPending
					? "pointer-events-none opacity-50"
					: ""}
				href={getPageUrl(1)}
				onclick={(e) => {
					if (!musicIds.pagination.hasNextPage || listState.isPending) e.preventDefault();
				}}
			>
				next
				<ChevronRight class="ml-1 h-4 w-4" />
			</Button>
		</div>
	</div>
{/if}

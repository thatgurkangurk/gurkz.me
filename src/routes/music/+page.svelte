<script lang="ts">
	import type { PageServerData } from "./$types";
	import AddMusicIDForm from "./add-music-id-form.svelte";
	import * as Card from "$lib/components/ui/card";
	import AudioCard from "./audio-card.svelte";
	import { createInfiniteQuery } from "@tanstack/svelte-query";
	import { api } from "$lib/api";
	import { browser } from "$app/environment";
	import { onDestroy, onMount } from "svelte";
	import type { GetMusicIdsResponse } from "$lib/music-id/type";

	export let data: PageServerData;

	const query = createInfiniteQuery({
		queryKey: ["music_ids"],
		initialPageParam: 1,
		queryFn: ({ pageParam }) => api().getMusicIds(pageParam),
		getNextPageParam: (lastPage: GetMusicIdsResponse) => {
			if (lastPage.next) {
				return +lastPage.next;
			}

			return undefined;
		}
	});

	const handleScroll = () => {
		const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
		if (scrollTop + clientHeight >= scrollHeight - 20) {
			$query.fetchNextPage();
		}
	};

	$: {
		if (browser) {
			if (!$query.hasNextPage) {
				window.removeEventListener("scroll", handleScroll);
			}
		}
	}

	onMount(() => {
		if (browser) {
			window.addEventListener("scroll", handleScroll);
		}
	});

	onDestroy(() => {
		if (browser) {
			window.removeEventListener("scroll", handleScroll);
		}
	});
</script>

<h2 class="text-3xl">roblox music ID list</h2>
<p>hello! welcome to our roblox music ID list!</p>

{#if data.userIsAdmin}
	<Card.Root class="w-fit">
		<Card.Header>
			<Card.Title class="text-xl">Add a new ID</Card.Title>
		</Card.Header>
		<Card.Content>
			<AddMusicIDForm data={data.form} />
		</Card.Content>
	</Card.Root>
{/if}
{#if $query.status === "pending"}
	<span>loading</span>
{:else if $query.status === "error"}
	<span>error: {$query.error.message}</span>
{:else}
	<div
		class="pt-4 grid grid-cols-1 sm:grid-cols-2 w-full place-items-center md:grid-cols-3 xl:grid-cols-5 gap-4"
	>
		{#each $query.data.pages as page}
			{#each page.data as id}
				<AudioCard id={id.id} user={data.user} userIsAdmin={data.userIsAdmin} />
			{/each}
		{/each}
	</div>
{/if}

<button
	on:click={() => $query.fetchNextPage()}
	disabled={!$query.hasNextPage || $query.isFetchingNextPage}
>
	{#if $query.hasNextPage}
		load more
	{:else if $query.isFetching}
		loading...
	{:else}nothing more to load{/if}
</button>

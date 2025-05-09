<script lang="ts">
	import { safeParse } from "valibot";
	import type { PageProps } from "./$types";
	import { getFormatState, setFormatState } from "./components/format-context";
	import { idFormatSchema, type IdFormat } from "./components/format.svelte";
	import Options from "./components/options.svelte";
	import MusicCard from "./components/music-card.svelte";
	import CreateForm from "./components/create-form.svelte";
	import { createInfiniteQuery } from "@tanstack/svelte-query";
	import { orpc } from "$lib/orpc";
	import { Alert, AlertDescription, AlertTitle } from "$lib/components/ui/alert";
	import { Info, LoaderCircle } from "lucide-svelte";
	import { setVerifiedOnlyState } from "./components/verified-context.svelte";

	let { data }: PageProps = $props();

	setFormatState<IdFormat>("id_format", data.idFormat ?? "DEFAULT");
	setVerifiedOnlyState<boolean>(true);

	const format = getFormatState();

	let verifiedOnly = $state<boolean>(true);

	const query = createInfiniteQuery(() =>
		orpc.music.getMusicIds.infiniteOptions({
			input: (pageParam: string | undefined) => ({
				cursor: pageParam,
				limit: 10,
				verifiedOnly: verifiedOnly
			}),
			getNextPageParam: (lastPage) => lastPage.nextCursor,
			initialPageParam: undefined
		})
	);

	$effect(() => {
		const parseResult = safeParse(idFormatSchema, format.current);

		if (parseResult.success) return;

		console.warn("id format was invalid. reverting to DEFAULT");

		format.current = "DEFAULT";
	});

	function useInfiniteScroll(callback: () => void, options?: IntersectionObserverInit) {
		return (node: HTMLElement) => {
			const observer = new IntersectionObserver(([entry]) => {
				if (entry.isIntersecting) {
					callback();
				}
			}, options);

			observer.observe(node);

			return {
				destroy() {
					observer.disconnect();
				}
			};
		};
	}

	const infiniteScroll = useInfiniteScroll(
		() => {
			if (query.hasNextPage && !query.isFetchingNextPage) {
				query.fetchNextPage();
			}
		},
		{
			rootMargin: "200px"
		}
	);
</script>

<h1 class="text-4xl">music id list</h1>

<Options />

{#if data.subject}
	<CreateForm createMusicIdForm={data.createMusicIdForm} subject={data.subject} />
{/if}

<div
	class="pt-4 grid grid-cols-1 sm:grid-cols-2 w-full place-items-center md:grid-cols-3 xl:grid-cols-5 gap-4"
>
	{#if query.data?.pages}
		{#each query.data.pages as page}
			{#each page.data as musicId}
				<MusicCard id={musicId} />
			{/each}
		{/each}

		<div use:infiniteScroll></div>
	{:else}
		<Alert variant={"default"}>
			<Info class="h-4 w-4" />
			<AlertTitle>no data</AlertTitle>
			<AlertDescription>no music ids have been created</AlertDescription>
		</Alert>
	{/if}
</div>

{#if query.isFetchingNextPage}
	<LoaderCircle class="animate-spin" />
{/if}

<script lang="ts">
	import { safeParse } from "valibot";
	import type { PageProps } from "./$types";
	import { getFormatState, setFormatState } from "./components/format-context";
	import { idFormatSchema, type IdFormat } from "./components/format.svelte";
	import FormattedId from "./components/formatted-id.svelte";
	import Options from "./components/options.svelte";
	import MusicCard from "./components/music-card.svelte";

	let { data }: PageProps = $props();

	setFormatState<IdFormat>("id_format", data.idFormat ?? "DEFAULT");

	const format = getFormatState();

	$effect(() => {
		const parseResult = safeParse(idFormatSchema, format.current);

		if (parseResult.success) return;

		console.warn("id format was invalid. reverting to DEFAULT");

		format.current = "DEFAULT";
	});
</script>

<h1 class="text-4xl">music id list</h1>

<Options />
<div
	class="pt-4 grid grid-cols-1 sm:grid-cols-2 w-full place-items-center md:grid-cols-3 xl:grid-cols-5 gap-4"
>
	{#each data.musicIds as musicId}
		{#if musicId.verified}
			<MusicCard id={musicId} />
		{/if}
	{/each}
</div>

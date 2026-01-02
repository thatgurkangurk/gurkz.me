<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import {
		Card,
		CardContent,
		CardFooter,
		CardHeader,
		CardTitle
	} from "$lib/components/ui/card/index.js";
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();

	const stuff = [
		{
			name: "video to html table",
			path: "/video-to-table"
		}
	];
</script>

<h1 class="text-3xl">misc stuff</h1>

<div
	class="grid w-full grid-cols-1 place-items-center gap-4 pt-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5"
>
	{#each stuff as thing}
		<Card class="h-full w-full">
			<CardHeader>
				<CardTitle class="text-xl">{thing.name}</CardTitle>
			</CardHeader>
			<CardFooter class="grid grid-cols-1 gap-1">
				<Button href={thing.path}>open</Button>
			</CardFooter>
		</Card>
	{/each}
</div>

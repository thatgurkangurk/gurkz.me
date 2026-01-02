<script lang="ts">
	import {
		Card,
		CardContent,
		CardFooter,
		CardHeader,
		CardTitle
	} from "$lib/components/ui/card/index.js";
	import type { MusicIdWithCreator } from "$lib/server/db/schema/music";
	import FormattedId from "./formatted-id.svelte";

	type Props = {
		musicId: MusicIdWithCreator;
	};

	const dateFormat = new Intl.DateTimeFormat("en-GB", {
		dateStyle: "long"
	});

	let { musicId }: Props = $props();
</script>

<Card class="h-full w-full">
	<CardHeader>
		<CardTitle class="text-xl">{musicId.name}</CardTitle>
	</CardHeader>

	<CardContent>
		<div class="flex items-center gap-2 text-xl">
			<FormattedId robloxId={musicId.robloxId} />
		</div>
	</CardContent>
	<CardFooter class="grid grid-cols-1 gap-1">
		<div class="flex flex-row gap-2">
			<!-- delete music card -->
		</div>
		<p>
			created by <span>{musicId.creator.name}</span> on{" "}
			<span class="whitespace-nowrap">
				{dateFormat.format(musicId.created)}
			</span>
		</p>
	</CardFooter>
</Card>

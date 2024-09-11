<script lang="ts">
	import { Alert, AlertDescription, AlertTitle } from "$lib/components/ui/alert";
	import type { MusicId } from "$lib/music";
	import { Info } from "lucide-svelte";
	import type { PageServerData } from "./$types";

	type Props = {
		data: PageServerData;
	};

	let { data }: Props = $props();
</script>

<h1 class="text-3xl">music id list</h1>

<Alert class="w-fit">
	<Info class="h-5 w-5" />
	<AlertTitle>note</AlertTitle>
	<AlertDescription>this will look better (and have a form to add a new id) soon</AlertDescription>
</Alert>

{#each data.ids as id}
	<p>{id.name} - {id.robloxId}</p>
{/each}

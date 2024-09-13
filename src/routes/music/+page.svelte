<script lang="ts">
	import { Alert, AlertDescription, AlertTitle } from "$lib/components/ui/alert";
	import { Info } from "lucide-svelte";
	import type { PageServerData } from "./$types";
	import CopyButton from "$lib/components/copy-button.svelte";
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import CreateMusicForm from "$lib/components/forms/create-music-form.svelte";

	type Props = {
		data: PageServerData;
	};

	let { data }: Props = $props();
</script>

<h1 class="text-3xl">music id list</h1>

{#if data.canCreateMusicIds}
	<Alert class="w-fit">
		<Info class="h-5 w-5" />
		<AlertTitle>note</AlertTitle>
		<AlertDescription>this will look better (and have a form to add a new id) soon</AlertDescription
		>
	</Alert>
{/if}

<Card class="w-full max-w-xs">
	<CardHeader>
		<CardTitle>create a new music id</CardTitle>
	</CardHeader>
	<CardContent>
		<CreateMusicForm data={data.form} />
	</CardContent>
</Card>

{#each data.ids as id}
	<div class="flex flex-row gap-2 items-center">
		<p>{id.name} - {id.robloxId}</p>
		<CopyButton content={id.robloxId} />
	</div>
{/each}

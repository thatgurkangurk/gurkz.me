<script lang="ts">
	import { Alert, AlertDescription, AlertTitle } from "$lib/components/ui/alert";
	import { superForm } from "sveltekit-superforms";
	import { createMusicIdSchema } from "$lib/music";
	import { Info, LoaderCircle } from "lucide-svelte";
	import type { PageServerData } from "./$types";
	import CopyButton from "$lib/components/copy-button.svelte";
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import * as Form from "$lib/components/ui/form";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { Input } from "$lib/components/ui/input";
	import { Button } from "$lib/components/ui/button";

	type Props = {
		data: PageServerData;
	};

	let { data }: Props = $props();

	const form = superForm(data.form, {
		validators: zodClient(createMusicIdSchema),
	});

	const { form: formData, enhance, submitting, message } = form;
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
		<form method="post" use:enhance>
			<Form.Field {form} name="id">
				<Form.Control let:attrs>
					<Form.Label>roblox id</Form.Label>
					<Input required {...attrs} bind:value={$formData.id} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="name">
				<Form.Control let:attrs>
					<Form.Label>name</Form.Label>
					<Input required {...attrs} bind:value={$formData.name} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Button type="submit" disabled={$submitting}>
				{#if $submitting}
					<LoaderCircle class="h-4 w-4 animate-spin" />
					creating
				{:else}
					create
				{/if}
			</Button>
		</form>
	</CardContent>
</Card>

{#each data.ids as id}
	<div class="flex flex-row gap-2 items-center">
		<p>{id.name} - {id.robloxId}</p>
		<CopyButton content={id.robloxId} />
	</div>
{/each}

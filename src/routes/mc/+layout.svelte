<script lang="ts">
	import type { Snippet } from "svelte";
	import type { LayoutServerData } from "./$types";
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { formSchema } from "./lib/form";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { superForm } from "sveltekit-superforms";
	import * as Form from "$lib/components/ui/form";
	import { Input } from "$lib/components/ui/input";
	import { Button } from "$lib/components/ui/button";
	import { LoaderCircle } from "lucide-svelte";

	type Props = {
		children: Snippet;
		data: LayoutServerData;
	};

	let { children, data }: Props = $props();

	const form = superForm(data.form, {
		validators: zodClient(formSchema),
	});

	const { form: formData, enhance, submitting } = form;
</script>

<Card class="w-fit">
	<CardHeader>
		<CardTitle class="text-xl">get the server status</CardTitle>
	</CardHeader>
	<CardContent>
		<form method="post" action="/mc?/ping" use:enhance>
			<Form.Field {form} name="ip">
				<Form.Control let:attrs>
					<Form.Label>server address</Form.Label>
					<Input required {...attrs} bind:value={$formData.ip} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Button type="submit" disabled={$submitting}>
				{#if $submitting}
					<LoaderCircle class="h-4 w-4 animate-spin" />
					pinging...
				{:else}
					ping
				{/if}
			</Button>
		</form>
	</CardContent>
</Card>
{@render children()}

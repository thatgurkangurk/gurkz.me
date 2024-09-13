<script lang="ts">
	import { createMusicIdSchema, type CreateMusicIdSchema } from "$lib/music";
	import { superForm, type Infer, type SuperValidated } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { Input } from "$lib/components/ui/input";
	import { Button } from "$lib/components/ui/button";
	import * as Form from "$lib/components/ui/form";
	import { LoaderCircle } from "lucide-svelte";

	type Props = {
		data: SuperValidated<Infer<CreateMusicIdSchema>>;
	};

	let { data }: Props = $props();

	const form = superForm(data, {
		validators: zodClient(createMusicIdSchema),
	});

	const { form: formData, enhance, submitting } = form;
</script>

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

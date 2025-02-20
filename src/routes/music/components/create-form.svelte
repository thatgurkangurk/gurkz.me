<script lang="ts">
	import type { User } from "$lib/server/auth-subject";
	import SuperDebug, { superForm, type SuperValidated, type Infer } from "sveltekit-superforms";
	import { createMusicIdSchema, type CreateMusicIdSchema } from "../form";
	import * as Form from "$lib/components/ui/form/index.js";
	import { valibotClient } from "sveltekit-superforms/adapters";
	import { Input } from "$lib/components/ui/input";
	import { Button } from "$lib/components/ui/button";
	import { TrashIcon } from "lucide-svelte";
	import * as Card from "$lib/components/ui/card/index.js";
	import { dev } from "$app/environment";

	let {
		subject,
		createMusicIdForm
	}: {
		subject: User;
		createMusicIdForm: SuperValidated<Infer<CreateMusicIdSchema>>;
	} = $props();

	const form = superForm(createMusicIdForm, {
		validators: valibotClient(createMusicIdSchema)
	});

	const { form: formData, enhance, submitting, message, errors } = form;

	let maxTagsReached = $derived($formData.tags.length > 3);

	function removeTagByIndex(index: number) {
		$formData.tags = $formData.tags.filter((_, i) => i !== index);
	}

	function addTag() {
		if (maxTagsReached) return;
		$formData.tags = [...$formData.tags, ""];
	}
</script>

{#if subject}
	<Card.Root class="w-full max-w-xs">
		<Card.Header>
			<Card.Title>create a music id</Card.Title>
		</Card.Header>
		<Card.Content>
			{#if $message}
				{#if $message.type === "success"}
					<div class="text-emerald-400 text-sm font-medium">{$message.text}</div>
				{:else if $message.type === "error"}
					<div class="text-destructive text-sm font-medium">{$message.text}</div>
				{:else}
					<div class="text-sm font-medium">{$message.text}</div>
				{/if}
			{/if}
			<form action="?/create" method="POST" use:enhance>
				<Form.Field {form} name="id">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>roblox id</Form.Label>
							<Input {...props} bind:value={$formData.id} />
						{/snippet}
					</Form.Control>
					<Form.Description>this is the roblox sound id that you use in game</Form.Description>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="name">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>name</Form.Label>
							<Input {...props} bind:value={$formData.name} />
						{/snippet}
					</Form.Control>
					<Form.Description>give the id a good, descriptive name</Form.Description>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Fieldset {form} name="tags">
					<Form.Legend>tags</Form.Legend>
					{#each $formData.tags as _, i}
						<Form.ElementField {form} name="tags[{i}]">
							<Form.Control>
								{#snippet children({ props })}
									<div class="flex flex-row gap-2">
										<Form.Label class="sr-only">tag {i + 1}</Form.Label>
										<Input {...props} class="w-fit" bind:value={$formData.tags[i]} />
										<Button
											variant={"destructive"}
											type="button"
											onclick={() => removeTagByIndex(i)}><TrashIcon /></Button
										>
									</div>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.ElementField>
					{/each}
					<Button disabled={maxTagsReached} type="button" onclick={addTag}>add tag</Button>
					<Form.FieldErrors />
				</Form.Fieldset>

				<Form.Button disabled={$submitting}>
					{#if $submitting}
						creating
					{:else}
						create
					{/if}
				</Form.Button>
			</form>
		</Card.Content>
	</Card.Root>

	<SuperDebug theme="vscode" data={[$formData, $errors, $message]} display={dev} />
{/if}

<script lang="ts">
	import SuperDebug, { superForm, type Infer, type SuperValidated } from "sveltekit-superforms";
	import { schema, type CreateMusicIdSchema } from "../form";
	import {
		Control,
		Description,
		ElementField,
		Field,
		FieldErrors,
		Fieldset,
		Label,
		Legend
	} from "$lib/components/ui/form/index.js";
	import { zod4Client } from "sveltekit-superforms/adapters";
	import { dev } from "$app/environment";
	import Button from "$lib/components/ui/button/button.svelte";
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import TrashIcon from "@lucide/svelte/icons/trash";

	type Props = {
		data: SuperValidated<Infer<CreateMusicIdSchema>>;
	};
	let { data }: Props = $props();

	const form = superForm(data, {
		validators: zod4Client(schema)
	});
	const { form: formData, errors, enhance, message, constraints, submitting } = form;

	const maxTagsReached = $derived($formData.tags.length > 3);

	function removeTagByIndex(index: number): void {
		$formData.tags = $formData.tags.filter((_, i) => i !== index);
	}

	function addTag() {
		if (maxTagsReached) return;
		$formData.tags = [...$formData.tags, ""];
	}
</script>

<Card class="w-full max-w-xs">
	<CardHeader>
		<CardTitle>create a music id</CardTitle>
	</CardHeader>
	<CardContent>
		{#if $message}
			{#if $message.type === "success"}
				<div class="text-sm font-medium text-emerald-400">{$message.text}</div>
			{:else if $message.type === "error"}
				<div class="text-destructive text-sm font-medium">{$message.text}</div>
			{:else}
				<div class="text-sm font-medium">{$message.text}</div>
			{/if}
		{/if}
		<form method="post" use:enhance>
			<Field {form} name="robloxId">
				<Control>
					{#snippet children({ props })}
						<Label>roblox id</Label>
						<Input {...props} bind:value={$formData.robloxId} />
					{/snippet}
				</Control>
				<Description>this is the roblox sound id that you use in game</Description>
				<FieldErrors />
			</Field>
			<Field {form} name="name">
				<Control>
					{#snippet children({ props })}
						<Label>name</Label>
						<Input {...props} bind:value={$formData.name} />
					{/snippet}
				</Control>
				<Description>give the id a good, descriptive name</Description>
				<FieldErrors />
			</Field>

			<Fieldset {form} name="tags">
				<Legend>tags</Legend>
				{#each $formData.tags as _, i}
					<ElementField {form} name="tags[{i}]">
						<Control>
							{#snippet children({ props })}
								<div class="flex flex-row gap-2">
									<Label class="sr-only">tag {i + 1}</Label>
									<Input {...props} class="w-fit" bind:value={$formData.tags[i]} />
									<Button variant={"destructive"} type="button" onclick={() => removeTagByIndex(i)}
										><TrashIcon /></Button
									>
								</div>
							{/snippet}
						</Control>
						<FieldErrors />
					</ElementField>
				{/each}
				<Button disabled={maxTagsReached} type="button" onclick={addTag}>add tag</Button>
				<FieldErrors />
			</Fieldset>

			<Button type="submit" disabled={$submitting}>
				{#if $submitting}
					creating
				{:else}
					create
				{/if}
			</Button>
		</form>
	</CardContent>
</Card>

{#if dev}
	<SuperDebug data={$formData} />
{/if}

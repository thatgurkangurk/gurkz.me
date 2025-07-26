<script lang="ts">
	import SuperDebug, { superForm, type Infer, type SuperValidated } from "sveltekit-superforms";
	import { schema, type CreateMusicIdSchema } from "../form";
	import { Control, ElementField, Field, FieldErrors, Fieldset, Label, Legend } from "formsnap";
	import { zod4Client } from "sveltekit-superforms/adapters";

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

<form
	method="post"
	use:enhance
	class="grid w-fit grid-cols-1 rounded-md p-2 outline outline-red-500"
>
	<Field {form} name="name">
		<Control>
			{#snippet children({ props })}
				<Label>name</Label>
				<input {...props} type="text" bind:value={$formData.name} />
			{/snippet}
		</Control>
		<FieldErrors />
	</Field>
	<Field {form} name="robloxId">
		<Control>
			{#snippet children({ props })}
				<Label>roblox id</Label>
				<input {...props} type="text" bind:value={$formData.robloxId} />
			{/snippet}
		</Control>
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
							<input {...props} class="w-fit" bind:value={$formData.tags[i]} />
							<button type="button" onclick={() => removeTagByIndex(i)}>delete</button>
						</div>
					{/snippet}
				</Control>
				<FieldErrors />
			</ElementField>
		{/each}
		<button disabled={maxTagsReached} type="button" onclick={addTag}>add tag</button>
		<FieldErrors />
	</Fieldset>
	<button disabled={$submitting}>{$submitting ? "submitting" : "submit"}</button>
</form>
<SuperDebug data={$formData} />

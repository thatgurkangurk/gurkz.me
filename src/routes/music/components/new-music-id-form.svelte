<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Label } from "$lib/components/ui/label";
	import { Trash2 } from "@lucide/svelte";
	import { ButtonGroup } from "$lib/components/ui/button-group/index.js";
	import { Input } from "$lib/components/ui/input";
	import InputErrors from "$lib/components/form/input-errors.svelte";
	import { toErrors } from "$lib/utils/to-errors";
	import { configureForm } from "$lib/remote-form.svelte";
	import { toast } from "svelte-sonner";
	import { createMusicId } from "$lib/api/music.remote";
	import { createMusicIdSchema } from "../schemas";
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card/index.js";
	import { autoAnimate } from "$lib/attachments/auto-animate.svelte";

	let formEl: HTMLFormElement | undefined = $state.raw();

	const configured = configureForm(() => ({
		form: createMusicId,
		formEl,
		schema: createMusicIdSchema,
		navBlockMessage: "you have unsaved changes. are you sure?",
		onresult: ({ success, error }) => {
			if (success) {
				toast.success("successfully submitted");
			} else if (error) {
				toast.error(error);
			}
		}
	}));

	let tags = $state<string[]>([]);
	createMusicId.fields.tags.set(tags);

	function addTag() {
		if (tags.length >= 4) return;
		tags.push("");
	}

	function removeTag(indexToRemove: number) {
		tags.splice(indexToRemove, 1);
	}

	function removeAllTags() {
		tags.length = 0;
	}

	const { form, attributes, submitting } = $derived(configured());
</script>

<Card class="w-full max-w-xs">
	<CardHeader>
		<CardTitle>create a music id</CardTitle>
	</CardHeader>
	<CardContent>
		<form bind:this={formEl} {...attributes} enctype="multipart/form-data">
			<div>
				<Label class={[!!form.fields.name.issues() && "text-destructive", "pb-2"]}>name</Label>
				<Input
					{...form.fields.name.as("text")}
					aria-errormessage="{form.fields.name.as('text').name}-error"
					aria-invalid={!!form.fields.name.issues()}
				/>

				<InputErrors
					name={form.fields.name.as("text").name}
					errors={toErrors(form.fields.name.issues()?.map((value) => value.message) ?? [])}
				/>
			</div>
			<br />
			<div>
				<Label class={[!!form.fields.robloxId.issues() && "text-destructive", "pb-2"]}
					>roblox id</Label
				>
				<Input
					{...form.fields.robloxId.as("text")}
					aria-errormessage="{form.fields.robloxId.as('text').name}-error"
					aria-invalid={!!form.fields.robloxId.issues()}
				/>

				<InputErrors
					name={form.fields.robloxId.as("text").name}
					errors={toErrors(form.fields.robloxId.issues()?.map((value) => value.message) ?? [])}
				/>
			</div>

			<br />

			<div {@attach autoAnimate({ duration: 150 })}>
				{#each tags, idx (idx)}
					<div class="py-2">
						<Label class={[!!form.fields.tags[idx].issues() && "text-destructive", "pb-2"]}>
							tag {idx + 1}
						</Label>

						<ButtonGroup>
							<Input
								{...form.fields.tags[idx].as("text")}
								aria-errormessage="{form.fields.tags[idx].as('text').name}-error"
								aria-invalid={!!form.fields.tags[idx].issues()}
							/>

							<Button
								variant="destructive"
								type="button"
								disabled={!!form.pending}
								onclick={() => {
									removeTag(idx);
								}}
							>
								<Trash2 />
							</Button>
						</ButtonGroup>

						<InputErrors
							name={form.fields.tags[idx].as("text").name}
							errors={toErrors(form.fields.tags[idx].issues()?.map((value) => value.message) ?? [])}
						/>
					</div>
				{/each}
			</div>

			<div class="flex flex-row gap-2 py-2">
				<Button type="button" disabled={tags.length >= 4} onclick={addTag}>add tag</Button>

				<Button
					type="button"
					variant="destructive"
					disabled={tags.length === 0}
					onclick={removeAllTags}
				>
					remove all tags
				</Button>
			</div>

			<Button type="submit" disabled={submitting}>submit</Button>
		</form>
	</CardContent>
</Card>

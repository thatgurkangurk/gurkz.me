<script lang="ts">
	import { createMusicId } from "#lib/api/music.remote.js";
	import { autoAnimate } from "#lib/attachments/auto-animate.svelte.js";
	import InputErrors from "#lib/components/form/input-errors.svelte";
	import { ButtonGroup } from "#lib/components/ui/button-group/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import {
		Card,
		CardContent,
		CardFooter,
		CardHeader,
		CardTitle
	} from "#lib/components/ui/card/index.js";
	import { Input } from "#lib/components/ui/input/index.js";
	import { Label } from "#lib/components/ui/label/index.js";
	import { configureForm } from "#lib/remote-form.svelte.js";
	import { toErrors } from "#lib/utils/to-errors.js";

	import { Trash2 } from "@lucide/svelte";
	import { toast } from "svelte-sonner";

	import { createMusicIdSchema } from "../schemas";

	let formEl: HTMLFormElement | undefined = $state.raw();

	type Props = {
		currentPage: number;
		search: string;
		limit: number;
	};

	let { currentPage, search, limit }: Props = $props();

	const configured = configureForm(() => ({
		form: createMusicId,
		formEl,
		schema: createMusicIdSchema,
		navBlockMessage: "you have unsaved changes. are you sure?",
		onresult: ({ success, error, result }) => {
			if (success) {
				toast.success("successfully submitted");
				formEl?.reset();
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

<Card class="w-full max-w-md">
	<CardHeader>
		<CardTitle>create a music id</CardTitle>
	</CardHeader>

	<form bind:this={formEl} {...attributes} enctype="multipart/form-data">
		<input {...form.fields.currentPage.as("hidden", currentPage)} />
		<input {...form.fields.searchFilter.as("hidden", search)} />
		<input {...form.fields.limit.as("hidden", limit)} />

		<CardContent>
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
								size="icon"
								variant="outline"
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
		</CardContent>
		<CardFooter class="flex flex-row items-center justify-between py-2">
			<Button type="submit" disabled={submitting}>submit</Button>

			<div class="flex flex-row items-center gap-2">
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
		</CardFooter>
	</form>
</Card>

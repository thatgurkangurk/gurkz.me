<script lang="ts">
	import * as Field from "$lib/components/ui/field/index.js";
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card/index.js";
	import { Button } from "$lib/components/ui/button";
	import Trash from "@lucide/svelte/icons/trash";
	import { createMusicId } from "$lib/music/music.remote.js";
	import LoaderCircle from "@lucide/svelte/icons/loader-circle";
	import { toast } from "svelte-sonner";
	import { autoAnimate } from "$lib/attachments/auto-animate";
	import Input from "$lib/components/ui/input/input.svelte";
	import InputErrors from "$lib/components/form/input-errors.svelte";

	const tagsAmount = $derived((createMusicId.fields.tags.value() || []).length);
	const maxTags = $derived(tagsAmount > 3);
	const noTags = $derived(!(tagsAmount > 0));

	function addTag() {
		createMusicId.fields.tags[(createMusicId.fields.tags.value() || []).length].set({
			id: crypto.randomUUID(),
			text: ""
		});
	}

	function clearTags() {
		createMusicId.fields.tags.set([]);
	}
</script>

<form
	{...createMusicId.enhance(async ({ submit, form }) => {
		const toastId = toast.loading("creating...");

		try {
			await submit();

			toast.success("successfully created", {
				id: toastId
			});

			form.reset();
		} catch (err) {
			console.error(err);
			toast.error("something went wrong", {
				id: toastId
			});
		}
	})}
	onchange={() => createMusicId.validate()}
>
	<Card class="w-full max-w-xs">
		<CardHeader>
			<CardTitle>create a music id</CardTitle>
		</CardHeader>
		<CardContent>
			<div class="grid grid-cols-1 gap-2">
				<Field.Set>
					<Field.Group>
						<Field.Field data-invalid={!!createMusicId.fields.name.issues()}>
							<Field.Label for="music_id_name">name</Field.Label>
							<Input
								id="music_id_name"
								placeholder="a very nice song"
								data-invalid={!!createMusicId.fields.name.issues()}
								{...createMusicId.fields.name.as("text")}
							/>
							<Field.Error>
								<InputErrors
									name="music_id_name"
									errors={createMusicId.fields.name.issues()?.map((i) => i.message)!}
								/>
							</Field.Error>
							<Field.Description>give the music id a good, descriptive name</Field.Description>
						</Field.Field>
						<Field.Field data-invalid={!!createMusicId.fields.robloxId.issues()}>
							<Field.Label for="music_id_roblox_id">roblox id</Field.Label>
							<Input
								id="music_id_roblox_id"
								placeholder="1273"
								data-invalid={!!createMusicId.fields.robloxId.issues()}
								{...createMusicId.fields.robloxId.as("text")}
							/>
							<Field.Error>
								<InputErrors
									name="music_id_roblox_id"
									errors={createMusicId.fields.robloxId.issues()?.map((i) => i.message)!}
								/>
							</Field.Error>
							<Field.Description>this is the sound id you use in games</Field.Description>
						</Field.Field>
					</Field.Group>

					<Field.Group>
						<div {@attach autoAnimate({ duration: 100 })} class="space-y-2">
							{#each createMusicId.fields.tags.value() as tag, idx (tag.id)}
								<Field.Field data-invalid={!!createMusicId.fields.tags[idx].text.issues()}>
									<Field.Label for="music_id_tags_{tag.id}">tag {idx + 1}</Field.Label>
									<div class="flex w-full max-w-sm items-center gap-2">
										<Input
											id="music_id_tags_{tag.id}"
											placeholder="a tag"
											data-invalid={!!createMusicId.fields.tags[idx].issues()}
											{...createMusicId.fields.tags[idx].text.as("text")}
										/>
										<Button
											onclick={() => {
												const tags = createMusicId.fields.tags.value() || [];
												createMusicId.fields.tags.set(tags.filter((_, index) => index !== idx));
											}}
											type="button"
											variant="destructive"
											size="icon"
										>
											<Trash />
										</Button>
									</div>

									<Field.Error>
										<InputErrors
											name="music_id_tags_{idx}"
											errors={createMusicId.fields.tags[idx].issues()?.map((i) => i.message)!}
										/>
									</Field.Error>
								</Field.Field>
							{/each}
						</div>
					</Field.Group>
				</Field.Set>

				<div class="flex gap-2">
					<Button type="button" disabled={maxTags} class="w-fit" onclick={addTag}>
						{#if maxTags}
							max tags reached
						{:else}
							add tag
						{/if}
					</Button>
					<Button
						type="button"
						disabled={noTags}
						variant="destructive"
						class="w-fit"
						onclick={clearTags}
					>
						remove all tags
					</Button>
				</div>

				<Button
					class="w-fit"
					aria-busy={!!createMusicId.pending}
					disabled={!!createMusicId.pending}
					type="submit"
				>
					{#if !!createMusicId.pending}
						<LoaderCircle class="animate-spin" />
					{/if}
					create
				</Button>
			</div>
		</CardContent>
	</Card>
</form>

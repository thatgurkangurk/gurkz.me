<script lang="ts">
	import {
		createForm,
		Field,
		FieldArray,
		Form,
		getInput,
		insert,
		remove,
		reset
	} from "@formisch/svelte";
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card/index.js";
	import { CreateMusicIdSchema } from "../forms";
	import TextInput from "$lib/components/form/text-input.svelte";
	import { Button } from "$lib/components/ui/button";
	import Trash from "@lucide/svelte/icons/trash";
	import { fromAction } from "svelte/attachments";
	import { orpc } from "$lib/orpc";
	import { createMutation, useQueryClient } from "@tanstack/svelte-query";
	import LoaderCircle from "@lucide/svelte/icons/loader-circle";
	import { toast } from "svelte-sonner";
	import { autoAnimate } from "$lib/attachments/auto-animate";
	import { listMusicIds } from "$lib/music/music.remote";

	const form = createForm({
		schema: CreateMusicIdSchema
	});

	const queryClient = useQueryClient();

	const mutation = createMutation(() =>
		orpc.music.create.mutationOptions({
			onSuccess: async () => {
				listMusicIds().refresh();
				await queryClient.invalidateQueries({
					queryKey: orpc.music.list.key()
				});
			}
		})
	);

	const maxTags = $derived(
		getInput(form, {
			path: ["tags"]
		}).length > 3
	);
	const noTags = $derived(
		!(
			getInput(form, {
				path: ["tags"]
			}).length > 0
		)
	);
</script>

<Form
	of={form}
	onsubmit={async (output) => {
		const promise = mutation.mutateAsync(output);
		toast.promise(promise, {
			loading: "creating...",
			success: "successfully created",
			error: "something went wrong"
		});
	}}
>
	<Card class="w-full max-w-xs">
		<CardHeader>
			<CardTitle>create a music id</CardTitle>
		</CardHeader>
		<CardContent>
			<div class="grid grid-cols-1 gap-2">
				<Field of={form} path={["name"]}>
					{#snippet children(field)}
						<TextInput
							{...field.props}
							input={field.input}
							errors={field.errors}
							type="text"
							label="name"
							placeholder="a very nice song"
							required
						/>
					{/snippet}
				</Field>
				<Field of={form} path={["robloxId"]}>
					{#snippet children(field)}
						<TextInput
							{...field.props}
							input={field.input}
							errors={field.errors}
							type="text"
							label="roblox id"
							placeholder="1273"
							required
						/>
					{/snippet}
				</Field>

				<FieldArray of={form} path={["tags"]}>
					{#snippet children(fieldArray)}
						<div {@attach autoAnimate({ duration: 100 })} class="space-y-2">
							{#each fieldArray.items as item, index (item)}
								<Field of={form} path={["tags", index]}>
									{#snippet children(field)}
										<TextInput
											{...field.props}
											input={field.input}
											errors={field.errors}
											type="text"
											label="tag {index + 1}"
											placeholder="a tag"
											required
										>
											{#snippet button()}
												<Button
													onclick={() =>
														remove(form, {
															path: ["tags"],
															at: index
														})}
													type="button"
													variant="destructive"
													size="icon"
												>
													<Trash />
												</Button>
											{/snippet}
										</TextInput>
									{/snippet}
								</Field>
							{/each}
						</div>
					{/snippet}
				</FieldArray>
				<div class="flex gap-2">
					<Button
						type="button"
						disabled={maxTags}
						class="w-fit"
						onclick={() =>
							insert(form, {
								path: ["tags"],
								initialInput: ""
							})}
					>
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
						onclick={() => {
							reset(form, {
								path: ["tags"]
							});
						}}
					>
						remove all tags
					</Button>
				</div>

				<Button
					class="w-fit"
					disabled={!form.isDirty || !form.isValid || form.isSubmitting}
					type="submit"
				>
					{#if form.isSubmitting}
						<LoaderCircle class="animate-spin" />
					{/if}
					create
				</Button>
			</div>
		</CardContent>
	</Card>
</Form>

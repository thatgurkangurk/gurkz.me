<script lang="ts">
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import {
		Dialog,
		DialogContent,
		DialogFooter,
		DialogHeader,
		DialogTitle,
		DialogTrigger
	} from "$lib/components/ui/dialog/index.js";
	import LoaderCircle from "@lucide/svelte/icons/loader-circle";
	import type { MusicIdWithCreator } from "$lib/schemas/music";
	import { cn } from "$lib/utils";
	import { toast } from "svelte-sonner";
	import {
		createForm,
		Field,
		FieldArray,
		Form,
		getInput,
		insert,
		remove,
		reset,
		setInput
	} from "@formisch/svelte";
	import { EditMusicIdSchema } from "../forms";
	import TextInput from "$lib/components/form/text-input.svelte";
	import { autoAnimate } from "$lib/attachments/auto-animate";
	import Trash from "@lucide/svelte/icons/trash";
	import { Switch } from "$lib/components/ui/switch";
	import { Label } from "$lib/components/ui/label";
	import { hasPermission } from "$lib/permissions";
	import { deleteMusicId, editMusicId, listMusicIds } from "$lib/music/music.remote.js";
	import { getSession } from "$lib/auth.remote";

	type Props = {
		musicId: MusicIdWithCreator;
	};

	let { musicId }: Props = $props();

	let open = $state<boolean>(false);

	const form = createForm({
		schema: EditMusicIdSchema,
		initialInput: musicId
	});

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

	const session = $derived(await getSession());
</script>

<Dialog bind:open>
	<DialogTrigger class={cn(buttonVariants({ variant: "secondary" }), "w-fit")}>edit</DialogTrigger>

	<DialogContent>
		<DialogHeader>
			<DialogTitle>
				editing "{musicId.name}"?
			</DialogTitle>
		</DialogHeader>
		<Form
			of={form}
			onsubmit={async (output) => {
				const promise = editMusicId(output);
				toast.promise(promise, {
					loading: "creating...",
					success: () => {
						open = false;
						reset(form, {
							initialInput: musicId
						});
						return "successfully created";
					},
					error: "something went wrong"
				});
			}}
		>
			<div class="flex items-center gap-2">
				<div class="space-y-4">
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

					{#if session?.user && hasPermission(session.user, "MANAGE_MUSIC_IDS")}
						<Field of={form} path={["verified"]}>
							{#snippet children(field)}
								<Label>verified</Label>
								<Switch
									bind:checked={
										() => field.input,
										(v) => {
											setInput(form, {
												path: field.path,
												input: v || false
											});
										}
									}
									required
								/>
							{/snippet}
						</Field>
					{/if}
					<Field of={form} path={["working"]}>
						{#snippet children(field)}
							<Label>working</Label>
							<Switch
								bind:checked={
									() => field.input,
									(v) => {
										setInput(form, {
											path: field.path,
											input: v || false
										});
									}
								}
								required
							/>
						{/snippet}
					</Field>

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
				</div>
			</div>

			<DialogFooter class="grid grid-cols-2 pt-2">
				<Button
					disabled={!form.isDirty ||
						!form.isValid ||
						form.isSubmitting ||
						editMusicId.pending > 0}
					type="submit"
				>
					{#if deleteMusicId.pending > 0}
						<LoaderCircle class="animate-spin" />
					{/if}
					save
				</Button>
				<Button onclick={() => (open = false)} type="button" variant={"secondary"}>cancel</Button>
			</DialogFooter>
		</Form>
	</DialogContent>
</Dialog>

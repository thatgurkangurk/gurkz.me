<script lang="ts">
	import {
		Card,
		CardContent,
		CardFooter,
		CardHeader,
		CardTitle
	} from "$lib/components/ui/card/index.js";
	import type { PageProps } from "./$types";
	import FormatSelector from "./components/format-selector.svelte";
	import MusicCard from "./components/music-card.svelte";
	import { scope } from "simple:scope";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { ConfirmDeleteDialog } from "$lib/components/ui/confirm-delete-dialog";
	import { superForm } from "sveltekit-superforms";
	import SuperDebug from "sveltekit-superforms/SuperDebug.svelte";
	import * as Field from "$lib/components/ui/field/index.js";
	import { Button } from "$lib/components/ui/button";
	import { zod4Client } from "sveltekit-superforms/adapters";
	import { createMusicIdSchema } from "./schemas";
	import * as Alert from "$lib/components/ui/alert/index.js";
	import { Bomb, CircleCheckBig, TriangleAlert } from "@lucide/svelte";
	import { useSession } from "$lib/session.svelte";
	import { getMusicIds } from "$lib/api/music.remote.js";

	let { data }: PageProps = $props();

	let searchFilter = $state("");

	let musicIds = $derived(await getMusicIds());

	const filteredMusicIds = $derived(
		musicIds.filter((id) => id.name.toLowerCase().includes(searchFilter.toLowerCase()))
	);

	// svelte-ignore state_referenced_locally its ok
	const { form, enhance, errors, delayed, message, constraints } = superForm(data.form, {
		validators: zod4Client(createMusicIdSchema),
		validationMethod: "auto"
	});

	const session = useSession();
</script>

<h1 class="text-3xl">music id list</h1>

{#if session.current?.user && session.current.user.permissions.includes("CREATE_MUSIC_IDS")}
	<div class="py-2">
		<Card class="w-full max-w-xs">
			<CardHeader>
				<CardTitle>create a music id</CardTitle>
				{#if $message}
					<Alert.Root variant={$message.type === "error" ? "destructive" : "default"}>
						{#if $message.type === "success"}
							<CircleCheckBig />
						{:else if $message.type === "warning"}
							<TriangleAlert />
						{:else if $message.type === "error"}
							<Bomb />
						{/if}

						<Alert.Title>{$message.title}</Alert.Title>
						<Alert.Description>{$message.text}</Alert.Description>
					</Alert.Root>
				{/if}
			</CardHeader>
			<CardContent>
				<form method="POST" use:enhance>
					<Field.Field data-invalid={$errors.name ? "true" : undefined}>
						<Field.Label for="name">name</Field.Label>
						<Input
							id="name"
							name="name"
							bind:value={$form.name}
							aria-invalid={$errors.name ? "true" : undefined}
							{...$constraints.name}
						/>
						<Field.Error>{$errors.name?.join(", ")}</Field.Error>
					</Field.Field>

					<Field.Field data-invalid={$errors.robloxId ? "true" : undefined}>
						<Field.Label for="robloxId">roblox id</Field.Label>
						<Input
							id="robloxId"
							name="robloxId"
							bind:value={$form.robloxId}
							aria-invalid={$errors.robloxId ? "true" : undefined}
							{...$constraints.robloxId}
						/>
						<Field.Error>{$errors.robloxId?.join(", ")}</Field.Error>
					</Field.Field>

					{#each $form.tags as _, i}
						<div>
							<Field.Field data-invalid={$errors.robloxId ? "true" : undefined}>
								<Field.Label for="tag_{i}">tag {i + 1}</Field.Label>
								<Input
									id="tag_{i}"
									name="tags"
									bind:value={$form.tags[i]}
									aria-invalid={$errors.tags?.[i] ? "true" : undefined}
									{...$constraints.tags}
								/>
								<Field.Error>{$errors.tags?.[i]?.join(", ")}</Field.Error>
							</Field.Field>
						</div>
					{/each}

					<div class="grid min-w-full grid-cols-2 gap-2 py-2">
						<Button
							type="button"
							variant="outline"
							size="sm"
							disabled={$form.tags.length >= 4}
							onclick={() => {
								form.update(
									($form) => {
										$form.tags.push("");
										return $form;
									},
									{ taint: false }
								);
							}}>add tag</Button
						>

						<Button
							type="button"
							variant="destructive"
							size="sm"
							disabled={$form.tags.length === 0}
							onclick={() => {
								form.update(
									($form) => {
										$form.tags = [];
										return $form;
									},
									{ taint: false }
								);
							}}>remove all tags</Button
						>
					</div>

					<Button type="submit" loading={$delayed}>submit</Button>
				</form>
			</CardContent>
		</Card>
	</div>
{/if}

{#if import.meta.env.DEV}
	<SuperDebug data={$form} />
{/if}

<FormatSelector />

<ConfirmDeleteDialog />

<div class="grid max-w-60 grid-cols-1 gap-2 pt-4">
	<div>
		<Label for={scope("search_filter")} class="pb-2">search</Label>
		<Input id={scope("search_filter")} bind:value={searchFilter} />
	</div>
</div>

<div
	class="grid w-full grid-cols-1 place-items-center gap-4 pt-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5"
>
	{#each filteredMusicIds as musicId (musicId.id)}
		<MusicCard {musicId} />
	{/each}
</div>

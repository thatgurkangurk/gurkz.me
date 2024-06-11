<script lang="ts">
	import type { PageData } from "./$types";
	import * as Card from "$lib/components/ui/card";
	import AudioCard from "./audio-card.svelte";
	import * as Form from "$lib/components/ui/form";
	import { trpc } from "$lib/trpc/client";
	import { browser } from "$app/environment";
	import { onDestroy, onMount } from "svelte";
	import AudioCardSkeleton from "./audio-card-skeleton.svelte";
	import { toast } from "svelte-sonner";
	import { defaults, superForm } from "sveltekit-superforms";
	import { zod } from "sveltekit-superforms/adapters";
	import { createMusicIdSchema } from "./validation";
	import { Input } from "$lib/components/ui/input";
	import { LoaderCircle } from "lucide-svelte";

	export let data: PageData;

	let toastId: string | number = "";

	const api = trpc();

	const query = api.music.getInfiniteIds.createInfiniteQuery(
		{},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor
		}
	);

	const createMusicId = api.music.createMusicId.createMutation({
		onError: () => {
			toast.dismiss(toastId);
			toast.error("something went wrong while creating the id");
		},
		onSuccess: () => {
			toast.dismiss(toastId);
			toast.success("complete");
			$query.refetch();
		}
	});

	const deleteMusicId = api.music.deleteMusicId.createMutation({
		onError: () => {
			toast.dismiss(toastId);
			toast.error("something went wrong while deleting the id");
		},
		onSuccess: () => {
			toast.dismiss(toastId);
			toast.success("deleted");
			$query.refetch();
		}
	});

	const form = superForm(defaults(zod(createMusicIdSchema)), {
		SPA: true,
		validators: zod(createMusicIdSchema),
		onUpdate({ form }) {
			if (form.valid) {
				$createMusicId.mutate({
					id: form.data.id,
					name: form.data.name
				});
			}
		}
	});

	const { form: formData, enhance } = form;

	const handleScroll = () => {
		const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
		if (scrollTop + clientHeight >= scrollHeight - 20) {
			$query.fetchNextPage();
		}
	};

	$: {
		if (browser) {
			if (!$query.hasNextPage) {
				window.removeEventListener("scroll", handleScroll);
			}
		}
	}

	onMount(() => {
		if (browser) {
			window.addEventListener("scroll", handleScroll);
		}
	});

	onDestroy(() => {
		if (browser) {
			window.removeEventListener("scroll", handleScroll);
		}
	});
</script>

<h2 class="text-3xl">roblox music ID list</h2>
<p>hello! welcome to our roblox music ID list!</p>

{#if data.userIsAdmin}
	<Card.Root class="w-fit">
		<Card.Header>
			<Card.Title class="text-xl">Add a new ID</Card.Title>
		</Card.Header>
		<Card.Content>
			<form method="post" use:enhance>
				<Form.Field {form} name="name">
					<Form.Control let:attrs>
						<Form.Label>Name</Form.Label>
						<Input {...attrs} bind:value={$formData.name} />
					</Form.Control>
					<Form.Description>Give the ID a name that describes the sound</Form.Description>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="id">
					<Form.Control let:attrs>
						<Form.Label>Music ID</Form.Label>
						<Input type="number" {...attrs} bind:value={$formData.id} />
					</Form.Control>
					<Form.Description
						>This is the ID that you use in (for example: boomboxes)</Form.Description
					>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Button disabled={$createMusicId.isPending}
					>{#if $createMusicId.isPending}
						<LoaderCircle class="h-6 w-6 animate-spin" />
					{/if} Create</Form.Button
				>
			</form>
		</Card.Content>
	</Card.Root>
{/if}
{#if $query.status === "pending"}
	<div
		class="pt-4 grid grid-cols-1 sm:grid-cols-2 w-full place-items-center md:grid-cols-3 xl:grid-cols-5 gap-4"
	>
		<AudioCardSkeleton />
		<AudioCardSkeleton />
		<AudioCardSkeleton />
		<AudioCardSkeleton />
		<AudioCardSkeleton />
		<AudioCardSkeleton />
		<AudioCardSkeleton />
		<AudioCardSkeleton />
		<AudioCardSkeleton />
	</div>
{:else if $query.status === "error"}
	<span>error: {$query.error.message}</span>
{:else}
	<div
		class="pt-4 grid grid-cols-1 sm:grid-cols-2 w-full place-items-center md:grid-cols-3 xl:grid-cols-5 gap-4"
	>
		{#each $query.data.pages as page}
			{#each page.data as musicId}
				<AudioCard user={data.user} {musicId} userIsAdmin={data.userIsAdmin} />
			{/each}
		{/each}
	</div>
{/if}

<button
	on:click={() => $query.fetchNextPage()}
	disabled={!$query.hasNextPage || $query.isFetchingNextPage}
>
	{#if $query.hasNextPage}
		load more
	{:else if $query.isFetching}
		<AudioCardSkeleton />
		<AudioCardSkeleton />
		<AudioCardSkeleton />
		<AudioCardSkeleton />
		<AudioCardSkeleton />
		<AudioCardSkeleton />
		<AudioCardSkeleton />
		<AudioCardSkeleton />
		<AudioCardSkeleton />
	{:else}nothing more to load{/if}
</button>

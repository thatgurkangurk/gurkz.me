<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import type { PageData } from "./$types";
	import AddMusicIDForm from "./add-music-id-form.svelte";
	import * as Card from "$lib/components/ui/card";
	import ClipboardCopyButton from "$lib/components/clipboard-copy-button.svelte";
	import { enhance } from "$app/forms";

	export let data: PageData;
</script>

<h2 class="text-3xl">roblox music ID list</h2>
<p>hello! welcome to our roblox music ID list!</p>

{#if data.userIsAdmin}
	<Card.Root class="w-fit">
		<Card.Header>
			<Card.Title class="text-xl">Add a new ID</Card.Title>
		</Card.Header>
		<Card.Content>
			<AddMusicIDForm data={data.form} />
		</Card.Content>
	</Card.Root>
{/if}

<div
	class="pt-4 grid grid-cols-1 sm:grid-cols-2 w-full place-items-center md:grid-cols-3 xl:grid-cols-5 gap-4"
>
	{#each data.ids as id}
		<Card.Root class="w-full h-full">
			<Card.Header>
				<Card.Title class="text-xl">{id.name}</Card.Title>
			</Card.Header>
			<Card.Content class="flex items-center text-xl">
				<span>{id.robloxId}</span>
				<ClipboardCopyButton contentToCopy={id.robloxId} />
			</Card.Content>
			<Card.Footer class="grid grid-cols-1">
				<span>Created by: {id.ownerUsername}</span>
				{#if data.user}
					{#if id.ownerId === data.user.id || data.userIsAdmin}
						<form action="?/delete" method="post" use:enhance>
							<input type="hidden" name="id" value={id.id} />
							<Button variant="destructive">delete</Button>
						</form>
					{/if}
				{/if}
			</Card.Footer>
		</Card.Root>
	{/each}
</div>

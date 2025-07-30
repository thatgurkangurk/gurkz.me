<script lang="ts">
	import { authClient } from "$lib/auth-client";
	import CopyButton from "$lib/components/copy-button.svelte";
	import { hasPermission } from "$lib/permissions";
	import type { PageProps } from "./$types";
	import CreateForm from "./components/create-form.svelte";
	import FormatSelector from "./components/format-selector.svelte";
	import { format } from "./format";

	let { data }: PageProps = $props();
	const session = authClient.useSession();
</script>

<h1 class="text-3xl">music id list</h1>

{#if $session.data && hasPermission($session.data.user, "CREATE_MUSIC_IDS")}
	<CreateForm data={data.form} />
{/if}

<FormatSelector />

<div class="grid grid-cols-1 gap-2">
	{#each data.musicIds as musicId (musicId.id)}
		<div class="flex items-center gap-2">
			<p class="pb-1">{musicId.name} - {format(musicId.robloxId)}</p>
			<CopyButton
				content={format(musicId.robloxId)}
				variant="secondary"
				aria-label="copy roblox id {format(musicId.robloxId)} for {musicId.name}"
			>
				{#snippet idle()}
					copy
				{/snippet}
				{#snippet copied()}
					copied
				{/snippet}
			</CopyButton>
		</div>
	{/each}
</div>

<script lang="ts">
	import { authClient } from "$lib/auth-client";
	import { hasPermission } from "$lib/permissions";
	import type { PageProps } from "./$types";
	import CreateForm from "./components/create-form.svelte";
	import FormatSelector from "./components/format-selector.svelte";
	import MusicCard from "./components/music-card.svelte";

	let { data }: PageProps = $props();
	const session = authClient.useSession();
</script>

<h1 class="text-3xl">music id list</h1>

{#if $session.data && hasPermission($session.data.user, "CREATE_MUSIC_IDS")}
	<CreateForm data={data.form} />
{/if}

<FormatSelector />

<div
	class="grid w-full grid-cols-1 place-items-center gap-4 pt-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5"
>
	{#each data.musicIds as musicId (musicId.id)}
		{#if musicId.verified}
			<MusicCard {musicId} />
		{/if}
	{/each}
</div>

<script lang="ts">
	import { authClient } from "$lib/auth-client";
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

{#each data.musicIds as musicId (musicId.id)}
	<p>{musicId.name} - {format(musicId.robloxId)}</p>
{/each}

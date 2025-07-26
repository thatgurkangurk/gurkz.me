<script lang="ts">
	import SuperDebug from "sveltekit-superforms";
	import { enhance } from "$app/forms";
	import { superForm } from "sveltekit-superforms";
	import type { PageProps } from "./$types";
	import { authClient } from "$lib/auth-client";
	import { hasPermission } from "$lib/permissions";
	import CreateForm from "./components/create-form.svelte";

	let { data }: PageProps = $props();
	let id = $props.id();
	const { form, message, constraints, errors } = superForm(data.form);
	const session = authClient.useSession();
</script>

<h1 class="text-3xl">music id list</h1>

<p>{$message}</p>

{#if $session.data && hasPermission($session.data.user, "CREATE_MUSIC_IDS")}
	<CreateForm data={data.form} />
{/if}

{#each data.musicIds as musicId (musicId.id)}
	<p>{musicId.name} - {musicId.robloxId}</p>
{/each}

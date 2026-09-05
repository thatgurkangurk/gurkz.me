<script lang="ts">
	import { useSession } from "#lib/session.svelte.js";
	import UserSettings from "./components/user-settings.svelte";

	const session = useSession();
</script>

<h1 class="text-3xl font-bold tracking-tight md:text-4xl">hello {session.current?.user.name}!</h1>

<br />

<UserSettings />

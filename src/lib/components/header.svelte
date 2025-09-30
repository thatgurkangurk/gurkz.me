<script lang="ts">
	import ModeToggle from "./mode-toggle.svelte";
	import NavLink from "./nav-link.svelte";
	import { useSession, useSignIn, useSignOut } from "$lib/session";
	import { Button } from "./ui/button";

	const session = useSession();
	const { mutateAsync: signOutAsync } = useSignOut();
	const { mutateAsync: signInAsync } = useSignIn();
</script>

<nav class="flex w-full items-center gap-2 p-2">
	<NavLink activeClass="underline underline-offset-2 decoration-lime-500" href="/">home</NavLink>
	<NavLink activeClass="underline underline-offset-2 decoration-lime-500" href="/music">
		music id list
	</NavLink>

	<div class="ml-auto flex gap-2">
		{#if session.data}
			<div class="flex items-center-safe gap-2">
				<p>hello, {session.data.user.name}</p>
				<Button
					variant="link"
					onclick={async () => {
						await signOutAsync(null);
					}}>log out</Button
				>
			</div>
		{:else}
			<Button
				variant="link"
				onclick={async () => {
					await signInAsync({
						provider: "discord"
					});
				}}
			>
				log in
			</Button>
		{/if}
		<ModeToggle />
	</div>
</nav>

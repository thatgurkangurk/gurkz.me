<script lang="ts">
	import { route } from "$lib/ROUTES";
	import ModeToggle from "./mode-toggle.svelte";
	import NavLink from "./nav-link.svelte";
</script>

<nav class="flex w-full items-center gap-2 p-2">
	<NavLink activeClass="underline underline-offset-2 decoration-lime-500" href={route("/")}>
		home
	</NavLink>
	<NavLink activeClass="underline underline-offset-2 decoration-lime-500" href={route("/music")}>
		music id list
	</NavLink>

	<div class="ml-auto flex gap-2">
		<ModeToggle />
	</div>
</nav>

<script lang="ts">
	import NavLink from "./nav-link.svelte";
</script>

<nav class="flex flex-row gap-2 pl-2">
	<NavLink activeClass="underline underline-offset-2 decoration-lime-500" href="/">home</NavLink>
	<NavLink activeClass="underline underline-offset-2 decoration-lime-500" href="/music">
		music id list
	</NavLink>
</nav>

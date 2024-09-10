<script lang="ts">
	import { Menu } from "lucide-svelte";
	import Button from "../ui/button/button.svelte";
	import { Sheet, SheetContent } from "../ui/sheet";
	import NavLink from "./nav-link.svelte";
	import type { Link } from "./types";
	import ThemeSwitcher from "../theme-switcher.svelte";

	let sheetOpen = $state(false);

	const links: Link[] = [
		{
			href: "/",
			text: "gurkan's website",
			alwaysActive: true,
		},
		{
			href: "/",
			text: "Home",
		},
		{
			href: "/blog",
			text: "Blog",
		},
		{
			href: "/projects",
			text: "Projects",
		},
		{
			href: "/music",
			text: "Music IDs",
		},
	];
</script>

{#snippet navLinks(links: Link[])}
	{#each links as link}
		<NavLink {...link} onclick={() => (sheetOpen = false)} />
	{/each}
{/snippet}

<header
	class="z-50 sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 [grid-area:header]"
>
	<nav
		class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm w-full lg:gap-6"
	>
		{@render navLinks(links)}
	</nav>

	<Sheet open={sheetOpen} onOpenChange={(open) => (sheetOpen = open)}>
		<Button
			variant="outline"
			size="icon"
			class="shrink-0 md:hidden"
			onclick={() => (sheetOpen = true)}
		>
			<Menu class="h-5 w-5" />
			<span class="sr-only">toggle navigation menu</span>
		</Button>
		<SheetContent side="left">
			<nav class="grid gap-6 text-lg font-medium">
				{@render navLinks(links)}
			</nav>
		</SheetContent>
	</Sheet>
	<div class="ml-auto flex-1 sm:flex-initial" />
	<div class="flex flex-row items-center break-normal gap-2">
		<ThemeSwitcher />
	</div>
</header>

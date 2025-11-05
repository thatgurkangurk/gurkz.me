<script lang="ts">
	import Menu from "@lucide/svelte/icons/menu";
	import {
		Sheet,
		SheetContent,
		SheetHeader,
		SheetTitle,
		SheetTrigger
	} from "$lib/components/ui/sheet/index.js";
	import { cn } from "$lib/utils";
	import { Button, buttonVariants } from "../ui/button";
	import type { HeaderLinkProps } from "./header-link.svelte";
	import HeaderLink from "./header-link.svelte";
	import ModeToggle from "../mode-toggle.svelte";
	import { getSession, signIn, signOut } from "$lib/auth.remote.js";

	type NavLink = Omit<HeaderLinkProps, "inSheet">;

	const linksForEveryone: NavLink[] = [
		{
			href: "/",
			label: "home"
		},
		{
			href: "/music",
			label: "music id list"
		}
	];

	const sessionPromise = $derived(getSession());
	const session = $derived(await sessionPromise);

	const links = $derived.by(() => {
		if (session?.user.role === "admin")
			return [
				...linksForEveryone,
				{
					href: "/admin",
					label: "admin"
				}
			];

		return linksForEveryone;
	});

	let open = $state<boolean>(false);
</script>

{#snippet linksSnippet(inSheet: boolean = false)}
	{#each links as link (link.label)}
		{#if inSheet}
			<HeaderLink onclick={() => (open = false)} {...link} {inSheet} />
		{:else}
			<HeaderLink {...link} {inSheet} />
		{/if}
	{/each}
{/snippet}
<header
	class="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 md:px-6"
>
	<nav
		class="hidden w-full flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-8 md:text-sm lg:gap-10"
	>
		<a
			href="/"
			class="text-lg font-semibold text-foreground transition-colors hover:text-foreground/80"
		>
			gurkan's website
		</a>
		<div class="flex items-center gap-2 lg:gap-4">
			{@render linksSnippet(false)}
		</div>
	</nav>

	<Sheet bind:open>
		<SheetTrigger
			class={cn(
				buttonVariants({ variant: "ghost", size: "icon" }),
				"shrink-0 hover:bg-accent md:hidden"
			)}
		>
			<Menu class="h-5 w-5" />
			<span class="sr-only">toggle navigation menu</span>
		</SheetTrigger>
		<SheetContent side={"left"} class="w-[300px] sm:w-[400px]">
			<SheetHeader class="text-left">
				<SheetTitle class="text-xl font-semibold">gurkan's website</SheetTitle>
				<nav class="mt-6 flex flex-col gap-4">
					{@render linksSnippet(true)}
				</nav>
			</SheetHeader>
		</SheetContent>
	</Sheet>

	<div class="ml-auto flex items-center gap-2">
		{#if session}
			<div class="flex items-center-safe gap-2">
				<p class="whitespace-nowrap">hello, {session.user.name}</p>
				<form {...signOut}>
					<Button variant="link" type="submit">log out</Button>
				</form>
			</div>
		{:else}
			<form {...signIn}>
				<input {...signIn.fields.provider.as("hidden", "discord")} />
				<Button variant="link" type="submit">log in</Button>
			</form>
		{/if}
		<ModeToggle />
	</div>
</header>

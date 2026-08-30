<script lang="ts">
	import { page } from "$app/state";
	import { useSession } from "#lib/session.svelte.js";
	import { Button, buttonVariants } from "./ui/button";
	import UserMenu from "./user-menu.svelte";
	import Menu from "@lucide/svelte/icons/menu";
	import X from "@lucide/svelte/icons/x";
	import { Cookie } from "@lucide/svelte";
	import { sizeMap } from "./button.svelte";
	import { showPreferences } from "#lib/cookie-consent.js";
	import { slide } from "svelte/transition";
	import { cubicOut } from "svelte/easing";

	type NavLinkProps = {
		label: string;
		to: string;
	};

	type NavbarProps = {
		links: NavLinkProps[];
	};

	const session = useSession();

	let isOpen = $state(false);
	let mobileNavRef = $state<HTMLElement | null>(null);

	function toggleMenu() {
		isOpen = !isOpen;
	}

	function closeMenu() {
		isOpen = false;
	}

	function handleOutsideClick(event: MouseEvent) {
		if (isOpen && mobileNavRef && !mobileNavRef.contains(event.target as Node)) {
			closeMenu();
		}
	}
</script>

<svelte:window onclick={handleOutsideClick} />

{#snippet links(mobile: boolean)}
	{@render navbarLink({ label: "home", to: "/" }, mobile)}
	{@render navbarLink({ label: "ttcore", to: "/ttcore" }, mobile)}

	{#if session.current?.user.permissions.includes("VIEW_MUSIC_IDS")}
		{@render navbarLink({ label: "music id list", to: "/music" }, mobile)}
	{/if}

	{@render navbarLink({ label: "misc", to: "/misc" }, mobile)}

	{#if session.current?.user.admin}
		{@render navbarLink({ label: "admin", to: "/admin" }, mobile)}
	{/if}
{/snippet}

{#snippet navbarLink(props: NavLinkProps, mobile: boolean)}
	{#if mobile}
		{@render mobileNavLink(props)}
	{:else}
		{@render navLink(props)}
	{/if}
{/snippet}

{#snippet navLink(props: NavLinkProps)}
	{@const active = page.url.pathname === props.to}
	<a
		href={props.to}
		class={[
			"transition-colors duration-150",
			active
				? "font-medium text-primary"
				: "text-gray-700 hover:text-black dark:text-white/90 dark:hover:text-white"
		]}
	>
		{props.label}
	</a>
{/snippet}

{#snippet mobileNavLink(props: NavLinkProps)}
	{@const active = page.url.pathname === props.to}
	<a
		href={props.to}
		onclick={closeMenu}
		class={[
			"block rounded-lg px-4 py-2.5 text-base transition-colors duration-150",
			active
				? "bg-gray-100 font-medium text-primary dark:bg-white/10"
				: "text-gray-700 hover:bg-gray-100 hover:text-black dark:text-white/90 dark:hover:bg-white/5 dark:hover:text-white"
		]}
	>
		{props.label}
	</a>
{/snippet}

<nav class="fixed top-4 left-1/2 z-50 hidden w-[90%] max-w-5xl -translate-x-1/2 md:block">
	<div
		class="rounded-full border border-gray-200 bg-white/95 px-6 py-3 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-black/95"
	>
		<div class="flex items-center justify-between">
			<a href="/" class="flex items-center gap-2">
				<span class="text-lg font-bold tracking-wide text-black dark:text-white">
					gurkan's website
				</span>
			</a>

			<div class="flex items-center gap-8">
				{@render links(false)}
			</div>

			<div class="flex items-center gap-2">
				<Button
					type="button"
					onclick={showPreferences}
					variant="ghost"
					size={sizeMap["default"].icon}
				>
					<Cookie />
				</Button>
				<UserMenu />
			</div>
		</div>
	</div>
</nav>

<nav bind:this={mobileNavRef} class="fixed top-4 right-4 left-4 z-50 md:hidden">
	<div
		class="rounded-2xl border border-gray-200 bg-white/95 p-3 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-black/95"
	>
		<div class="flex items-center justify-between">
			<button
				type="button"
				onclick={toggleMenu}
				aria-expanded={isOpen}
				aria-controls="mobile-menu-dropdown"
				aria-label="toggle navigation menu"
				class={buttonVariants({
					variant: "ghost",
					size: "icon",
					class:
						"h-9 w-9 rounded-full bg-gray-100 text-black transition-transform duration-200 hover:bg-gray-200 active:scale-95 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
				})}
			>
				{#if isOpen}
					<X class="h-5 w-5" />
				{:else}
					<Menu class="h-5 w-5" />
				{/if}
			</button>

			<a href="/" onclick={closeMenu} class="flex items-center gap-2">
				<span class="text-base font-bold tracking-wide text-black dark:text-white">
					gurkan's website
				</span>
			</a>

			<div class="flex items-center gap-2">
				<Button
					type="button"
					onclick={showPreferences}
					variant="ghost"
					size={sizeMap["default"].icon}
				>
					<Cookie />
				</Button>
				<UserMenu />
			</div>
		</div>

		{#if isOpen}
			<div
				id="mobile-menu-dropdown"
				transition:slide={{ duration: 250, easing: cubicOut }}
				class="overflow-hidden"
			>
				<div class="mt-3 flex flex-col gap-1 border-t border-gray-200 pt-3 dark:border-white/10">
					{@render links(true)}
				</div>
			</div>
		{/if}
	</div>
</nav>

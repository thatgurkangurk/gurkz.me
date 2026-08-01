<script lang="ts">
	import { page } from "$app/state";
	import { useSession } from "$lib/session.svelte";
	import { buttonVariants } from "./ui/button";
	import UserMenu from "./user-menu.svelte";
	import LightSwitch from "./ui/light-switch/light-switch.svelte";
	import Menu from "@lucide/svelte/icons/menu";
	import X from "@lucide/svelte/icons/x";
	import { accordion } from "./accordion.svelte";

	type NavLinkProps = {
		label: string;
		to: string;
	};

	type NavbarProps = {
		links: NavLinkProps[];
	};

	let { links }: NavbarProps = $props();

	const session = useSession();

	function closeDetails(e: MouseEvent) {
		const details = (e.currentTarget as HTMLElement).closest("details");
		if (details) {
			const content = details.querySelector(".details-content") as HTMLElement;
			if (content) {
				const anim = content.animate(
					[
						{ height: `${content.offsetHeight}px`, opacity: 1 },
						{ height: "0px", opacity: 0 }
					],
					{ duration: 200, easing: "ease-out" }
				);
				anim.onfinish = () => {
					details.open = false;
				};
			} else {
				details.open = false;
			}
		}
	}
</script>

{#snippet navLink(props: NavLinkProps)}
	{@const active = page.url.pathname === props.to}
	<a
		href={props.to}
		class={[
			active
				? "font-medium text-primary"
				: "text-gray-700 hover:text-black dark:text-white/90 dark:hover:text-white"
		]}
		>{props.label}
	</a>
{/snippet}

{#snippet mobileNavLink(props: NavLinkProps)}
	{@const active = page.url.pathname === props.to}
	<a
		href={props.to}
		onclick={closeDetails}
		class={[
			"block rounded-lg px-4 py-2.5 text-base transition-colors",
			active
				? "bg-gray-100 font-medium text-primary dark:bg-white/10"
				: "text-gray-700 hover:bg-gray-100 hover:text-black dark:text-white/90 dark:hover:bg-white/5 dark:hover:text-white"
		]}
	>
		{props.label}
	</a>
{/snippet}

<!-- desktop navbar -->
<nav class="fixed top-4 left-1/2 z-50 hidden w-[90%] max-w-5xl -translate-x-1/2 md:block">
	<div
		class="rounded-full border border-gray-200 bg-white px-6 py-3 shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-black/95"
	>
		<div class="flex items-center justify-between">
			<a href="/" class="flex items-center gap-2">
				<span class="text-lg font-bold tracking-wide text-black dark:text-white">
					gurkan's website
				</span>
			</a>

			<div class="flex items-center gap-8">
				{#each links as link}
					{@render navLink(link)}
				{/each}

				{#if session.current?.user.admin}
					{@render navLink({ label: "admin", to: "/admin" })}
				{/if}
			</div>

			<div class="flex items-center gap-2">
				<LightSwitch variant={"ghost"} />
				<UserMenu />
			</div>
		</div>
	</div>
</nav>

<!-- mobile navbar -->
<nav class="fixed top-4 right-4 left-4 z-50 md:hidden">
	<details
		class="group rounded-2xl border border-gray-200 bg-white/95 p-3 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-black/95 [&>summary::-webkit-details-marker]:hidden"
		{@attach accordion}
	>
		<summary
			class="flex cursor-pointer list-none items-center justify-between outline-none select-none"
		>
			<div
				class={buttonVariants({
					variant: "ghost",
					size: "icon",
					class:
						"pointer-events-none h-9 w-9 rounded-full bg-gray-100 text-black hover:bg-gray-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
				})}
			>
				<Menu class="h-5 w-5 group-open:hidden" />
				<X class="hidden h-5 w-5 group-open:block" />
			</div>

			<a href="/" class="flex items-center gap-2">
				<span class="text-base font-bold tracking-wide text-black dark:text-white">
					gurkan's website
				</span>
			</a>

			<div class="flex items-center gap-2">
				<LightSwitch variant={"ghost"} />
				<UserMenu />
			</div>
		</summary>

		<div class="details-content overflow-hidden">
			<div class="mt-3 flex flex-col gap-1 border-t border-gray-200 pt-3 dark:border-white/10">
				{#each links as link}
					{@render mobileNavLink(link)}
				{/each}

				{#if session.current?.user.admin}
					{@render mobileNavLink({ label: "admin", to: "/admin" })}
				{/if}
			</div>
		</div>
	</details>
</nav>

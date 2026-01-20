<script lang="ts">
	import { page } from "$app/state";
	import { Sheet, SheetContent, SheetTrigger } from "$lib/components/ui/sheet/index.js";
	import { buttonVariants } from "./ui/button";
	import UserMenu from "./user-menu.svelte";
	import LightSwitch from "./ui/light-switch/light-switch.svelte";

	type NavLinkProps = {
		label: string;
		to: string;
	};

	type NavbarProps = {
		links: NavLinkProps[];
	};

	let { links }: NavbarProps = $props();

	let sheetOpen = $state<boolean>(false);
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

{#snippet sheetNavLink(props: NavLinkProps)}
	{@const active = page.url.pathname === props.to}
	<a
		href={props.to}
		onclick={() => {
			sheetOpen = false;
		}}
		class={[
			"px-6 py-3 text-base font-medium transition-colors hover:bg-gray-100 dark:hover:bg-white/5",
			active
				? "font-medium text-primary"
				: "text-gray-700 hover:text-black dark:text-white/90 dark:hover:text-white"
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
			</div>

			<div class="flex items-center gap-2">
				<LightSwitch variant={"ghost"} />
				<UserMenu />
				<!-- <ModeToggle />
				<UserButton size={"icon"} /> -->
			</div>
		</div>
	</div>
</nav>

<nav class="fixed top-4 right-4 left-4 z-50 md:hidden">
	<div
		class="rounded-full border border-gray-200 bg-white px-4 py-3 shadow-lg backdrop-blur-sm dark:border-white/10 dark:bg-black/95"
	>
		<div class="flex items-center justify-between">
			<Sheet bind:open={sheetOpen}>
				<SheetTrigger
					class={buttonVariants({
						variant: "ghost",
						size: "icon",
						class:
							"h-9 w-9 rounded-full bg-gray-100 text-black hover:bg-gray-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
					})}
				>
					<span class="icon-[lucide--menu] h-5 w-5"></span>
				</SheetTrigger>
				<SheetContent
					side={"left"}
					class="w-75 border-gray-200 bg-white p-0 backdrop-blur-md dark:border-white/10 dark:bg-black/98"
				>
					<div class="flex h-full flex-col">
						<div
							class="flex items-center justify-between border-b border-gray-200 px-6 py-6 dark:border-white/10"
						>
							<a href="/" class="flex items-center gap-2">
								<span class="text-base font-bold tracking-wide text-black dark:text-white">
									gurkan's website
								</span>
							</a>
						</div>

						<div class="flex flex-col gap-1 py-6">
							{#each links as link}
								{@render sheetNavLink(link)}
							{/each}
						</div>
					</div>
				</SheetContent>
			</Sheet>

			<a href="/" class="flex items-center gap-2">
				<span class="text-base font-bold tracking-wide text-black dark:text-white">
					gurkan's website
				</span>
			</a>

			<div class="flex-gap flex items-center gap-2">
				<LightSwitch variant={"ghost"} />
				<UserMenu />
				<!-- <ModeToggle />
				<UserButton size={"icon"} /> -->
			</div>
		</div>
	</div>
</nav>

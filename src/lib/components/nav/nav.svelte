<script lang="ts">
	import { Menu } from "lucide-svelte";
	import Button from "../ui/button/button.svelte";
	import { Sheet, SheetContent } from "../ui/sheet";
	import NavLink from "./nav-link.svelte";
	import type { Link } from "./link";
	import LightSwitch from "../light-switch.svelte";
	import { applyAction, enhance } from "$app/forms";
	import { toast } from "svelte-sonner";
	import { page } from "$app/state";
	import { useQueryClient } from "@tanstack/svelte-query";
	import { orpc } from "$lib/orpc";

	let sheetOpen = $state(false);

	const queryClient = useQueryClient();

	const links: Link[] = [
		{
			href: "/",
			text: "gurkan's website",
			alwaysActive: true
		},
		{
			href: "/",
			text: "home"
		},
		{
			href: "/music",
			text: "music id list"
		},
		{
			href: "/projects",
			text: "projects"
		}
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
	<div class="ml-auto flex-1 sm:flex-initial"></div>
	<div class="flex flex-row items-center break-normal gap-2">
		{#if page.data.subject}
			<div class="flex flex-row items-center">
				<p class="flex flex-row gap-1">hello, <span>{page.data.subject.username}</span></p>
				<form
					use:enhance={() => {
						const id = toast.loading("please wait", {
							description: "you're being logged out"
						});

						return async ({ result }) => {
							switch (result.type) {
								case "redirect": {
									toast.success("success", {
										description: "you have now logged out",
										id: id
									});
									break;
								}
								case "failure": {
									toast.error("error", {
										description: "something went wrong",
										id: id
									});
									break;
								}
							}

							await queryClient.invalidateQueries({
								queryKey: orpc.auth.getSession.key()
							});

							await applyAction(result);
						};
					}}
					method="POST"
					action="/auth?/logout"
				>
					<input
						type="hidden"
						hidden
						aria-hidden={true}
						name="redirect"
						value={page.url.pathname}
					/>
					<Button variant="link" type="submit">log out</Button>
				</form>
			</div>
		{:else}
			<form use:enhance method="POST" action="/auth?/login">
				<input type="hidden" hidden aria-hidden={true} name="redirect" value={page.url.pathname} />
				<Button variant="link" type="submit">log in</Button>
			</form>
		{/if}
		<LightSwitch />
	</div>
</header>

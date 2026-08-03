<script lang="ts">
	import { MediaQuery } from "svelte/reactivity";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import * as Drawer from "$lib/components/ui/drawer/index.js";
	import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
	import type { Snippet } from "svelte";
	import { useSession } from "$lib/session.svelte.js";

	type Props = {
		button: Snippet<
			[
				{
					toggleOpen: () => void;
				}
			]
		>;
	};

	let { button }: Props = $props();

	let open = $state(false);

	const isDesktop = new MediaQuery("(min-width: 768px)");

	const session = useSession();
</script>

{#snippet signinOptions()}
	<Button onclick={() => session.signInSocial("discord")}>sign in with discord</Button>
	<Button onclick={() => session.signInSocial("github")}>sign in with github</Button>
{/snippet}

{#if isDesktop.current}
	<Dialog.Root bind:open>
		{@render button({
			toggleOpen: () => (open = !open)
		})}
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title>sign in</Dialog.Title>
				<Dialog.Description>choose how you want to sign in</Dialog.Description>
			</Dialog.Header>
			<div class="grid items-start gap-4">
				{@render signinOptions()}
			</div>

			<Dialog.Close class={buttonVariants({ variant: "outline" })}>cancel</Dialog.Close>
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Drawer.Root bind:open>
		{@render button({
			toggleOpen: () => (open = !open)
		})}
		<Drawer.Content>
			<Drawer.Header class="text-start">
				<Drawer.Title>sign in</Drawer.Title>
				<Drawer.Description>choose how you want to sign in</Drawer.Description>
			</Drawer.Header>
			<div class="grid items-start gap-4 px-20 pb-120">
				{@render signinOptions()}
			</div>
			<Drawer.Footer class="pt-2">
				<Drawer.Close class={buttonVariants({ variant: "outline" })}>cancel</Drawer.Close>
			</Drawer.Footer>
		</Drawer.Content>
	</Drawer.Root>
{/if}

<script lang="ts">
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogFooter,
		DialogHeader,
		DialogTitle,
		DialogTrigger
	} from "$lib/components/ui/dialog/index.js";
	import LoaderCircle from "@lucide/svelte/icons/loader-circle";
	import type { MusicIdWithCreator } from "$lib/schemas/music";
	import { cn } from "$lib/utils";
	import { toast } from "svelte-sonner";
	import { deleteMusicId } from "$lib/music/music.remote.js";

	type Props = {
		musicId: MusicIdWithCreator;
	};

	let { musicId }: Props = $props();

	let open = $state<boolean>(false);
</script>

<Dialog bind:open>
	<DialogTrigger class={cn(buttonVariants({ variant: "destructive" }), "w-fit")}>
		delete
	</DialogTrigger>

	<DialogContent>
		<DialogHeader>
			<DialogTitle>
				are you sure you want to delete "{musicId.name}"?
			</DialogTitle>
			<DialogDescription>
				this cannot be undone. this will permanently delete this music id, and it cannot be
				recovered.
			</DialogDescription>
		</DialogHeader>
		<DialogFooter class="grid grid-cols-2">
			<Button
				disabled={deleteMusicId.pending > 0}
				type="button"
				variant={"destructive"}
				onclick={() => {
					const promise = deleteMusicId({
						id: musicId.id
					});
					toast.promise(promise, {
						loading: "deleting...",
						success: () => {
							open = false;
							return `successfully deleted "${musicId.name}"`;
						},
						error: "something went wrong"
					});
				}}
			>
				{#if deleteMusicId.pending > 0}
					<LoaderCircle class="animate-spin" />
				{/if}
				yes
			</Button>
			<Button onclick={() => (open = false)} type="button" variant={"secondary"}>no, cancel</Button>
		</DialogFooter>
	</DialogContent>
</Dialog>

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
	import { orpc } from "$lib/orpc";
	import type { MusicIdWithCreator } from "$lib/schemas/music";
	import { cn } from "$lib/utils";
	import { createMutation, useQueryClient } from "@tanstack/svelte-query";
	import { toast } from "svelte-sonner";
	import { listMusicIds } from "$lib/music/music.remote";

	type Props = {
		musicId: MusicIdWithCreator;
	};

	let { musicId }: Props = $props();

	let open = $state<boolean>(false);
	const queryClient = useQueryClient();
	const mutation = createMutation(() =>
		orpc.music.delete.mutationOptions({
			onSuccess: async () => {
				open = false;
				listMusicIds().refresh();
				await queryClient.refetchQueries({
					queryKey: orpc.music.list.key()
				});
			}
		})
	);
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
				disabled={mutation.isPending}
				type="button"
				variant={"destructive"}
				onclick={() => {
					const promise = mutation.mutateAsync({
						id: musicId.id
					});
					toast.promise(promise, {
						loading: "deleting...",
						success: `successfully deleted "${musicId.name}"`,
						error: "something went wrong"
					});
				}}
			>
				{#if mutation.isPending}
					<LoaderCircle class="animate-spin" />
				{/if}
				yes
			</Button>
			<Button onclick={() => (open = false)} type="button" variant={"secondary"}>no, cancel</Button>
		</DialogFooter>
	</DialogContent>
</Dialog>

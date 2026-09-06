<script lang="ts">
	import ClipCard from "#lib/components/ttcore/clip-card.svelte";
	import {
		AlertDialog,
		AlertDialogAction,
		AlertDialogCancel,
		AlertDialogContent,
		AlertDialogDescription,
		AlertDialogFooter,
		AlertDialogHeader,
		AlertDialogTitle,
		AlertDialogTrigger
	} from "#lib/components/ui/alert-dialog/index.js";
	import { Button, buttonVariants } from "#lib/components/ui/button/index.js";
	import { Spinner } from "#lib/components/ui/spinner/index.js";
	import type { Clip } from "#lib/types/clip.js";

	import Star from "@lucide/svelte/icons/star";
	import { createMutation } from "@tanstack/svelte-query";

	import { deleteClipMutation, setClipSelectedMutation } from "./query.js";

	type Props = {
		clip: Clip;
		submissionsOpen: boolean;
	};

	let { clip, submissionsOpen }: Props = $props();

	let deleting = $state(false);
	let dialogOpen = $state(false);

	const deleteMutation = createMutation(() => deleteClipMutation());
	const setSelectedMutation = createMutation(() => setClipSelectedMutation());
</script>

<ClipCard {clip}>
	{#snippet footer()}
		<!-- <EditClip {clip} /> -->
		<Button
			disabled={!submissionsOpen}
			onclick={async () => {
				await setSelectedMutation.mutateAsync({ clip, selected: !clip.selected });
			}}
			variant="outline"
			size="icon"
		>
			<Star {...clip.selected ? { fill: "#ffffff" } : {}} />
		</Button>
		<AlertDialog bind:open={dialogOpen}>
			<AlertDialogTrigger
				disabled={!submissionsOpen}
				onclick={() => (dialogOpen = true)}
				class={buttonVariants({ variant: "destructive" })}
			>
				delete
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						are you sure you want to delete "{clip.title}"?
					</AlertDialogTitle>
					<AlertDialogDescription>
						this clip will permanently be gone. you probably should just unselect it
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onclick={() => (dialogOpen = false)}>no, cancel</AlertDialogCancel>
					<AlertDialogAction
						disabled={deleting}
						onclick={async () => {
							deleting = true;
							await deleteMutation.mutateAsync(clip);
							deleting = false;
							dialogOpen = false;
						}}
					>
						{#if deleting}
							<Spinner />
						{/if}
						yes, delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	{/snippet}
</ClipCard>

<script lang="ts">
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import {
		Dialog,
		DialogContent,
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
	import {
		createForm,
		Field,
		FieldArray,
		Form,
		getInput,
		insert,
		remove,
		reset
	} from "@formisch/svelte";
	import { EditMusicIdSchema } from "../forms";
	import TextInput from "$lib/components/form/text-input.svelte";
	import { autoAnimate } from "$lib/attachments/auto-animate";
	import Trash from "@lucide/svelte/icons/trash";

	type Props = {
		musicId: MusicIdWithCreator;
	};

	let { musicId }: Props = $props();

	let open = $state<boolean>(false);

	const form = createForm({
		schema: EditMusicIdSchema,
		initialInput: musicId
	});

	const queryClient = useQueryClient();
	const mutation = createMutation(() =>
		orpc.music.edit.mutationOptions({
			onSuccess: async () => {
				open = false;
				await queryClient.refetchQueries({
					queryKey: orpc.music.get.key()
				});
				reset(form, {
					initialInput: musicId
				});
			}
		})
	);

<script>
  // Enforce a hard cap of 3 tags
  const maxTags = $derived(
    getInput(form, {
      path: ["tags"]
    }).length >= 3
  );
  const noTags = $derived(
    !(
      getInput(form, {
        path: ["tags"]
      }).length > 0
    )
  );
</script>

<!-- … -->

<div class="flex gap-2">
  <Button
    type="button"
    disabled={maxTags}
    class="w-fit"
    onclick={() => {
      if (maxTags) return;
      insert(form, {
        path: ["tags"],
        initialInput: ""
      });
    }}
  >
    {#if maxTags}
      max tags reached
    {:else}
      add tag
    {/if}
  </Button>
						<Button
							type="button"
							disabled={noTags}
							variant="destructive"
							class="w-fit"
							onclick={() => {
								reset(form, {
									path: ["tags"]
								});
							}}
						>
							remove all tags
						</Button>
					</div>
				</div>
			</div>

			<DialogFooter class="grid grid-cols-2 pt-2">
				<Button
					disabled={!form.isDirty || !form.isValid || form.isSubmitting || mutation.isPending}
					type="submit"
				>
					{#if mutation.isPending}
						<LoaderCircle class="animate-spin" />
					{/if}
					save
				</Button>
				<Button onclick={() => (open = false)} type="button" variant={"secondary"}>cancel</Button>
			</DialogFooter>
		</Form>
	</DialogContent>
</Dialog>

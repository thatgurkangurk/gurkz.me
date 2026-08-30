<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from "#lib/components/ui/card/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import Save from "@lucide/svelte/icons/save";
	import { useSession } from "#lib/session.svelte.js";
	import { toast } from "svelte-sonner";
	import { watch } from "runed";
	import { setDisplayName } from "#lib/api/users.remote.js";
	import { SetNewDisplayNameSchema } from "#lib/schemas/user.js";
	import { Label } from "#lib/components/ui/label/index.js";
	import { Input } from "#lib/components/ui/input/index.js";
	import InputErrors from "#lib/components/form/input-errors.svelte";
	import { toErrors } from "#lib/utils/to-errors.js";
	import ButtonGroup from "#lib/components/ui/button-group/button-group.svelte";
	import { Spinner } from "#lib/components/ui/spinner/index.js";

	const session = useSession();

	let form = $state<HTMLFormElement>();

	watch(
		() => session.current?.user.name,
		() => {
			form?.reset();
		}
	);
</script>

<Card class="w-full max-w-xl">
	<CardHeader>
		<CardTitle>display name</CardTitle>
	</CardHeader>
	<CardContent class="flex gap-2">
		<form
			bind:this={form}
			{...setDisplayName.preflight(SetNewDisplayNameSchema).enhance(async ({ element, submit }) => {
				try {
					if (await submit()) {
						element.reset();

						void session.refresh();
					}
				} catch (error) {
					console.error(error);
					toast.error("something went wrong");
				}
			})}
			oninput={() => setDisplayName.validate({ includeUntouched: false, preflightOnly: true })}
			enctype="multipart/form-data"
		>
			<div>
				<Label class={[!!setDisplayName.fields.displayName.issues() && "text-destructive", "pb-2"]}
					>display name</Label
				>
				<ButtonGroup>
					<Input
						{...setDisplayName.fields.displayName.as("text", session.current?.user.name || "")}
						aria-errormessage="{setDisplayName.fields.displayName.as('text').name}-error"
						aria-invalid={!!setDisplayName.fields.displayName.issues()}
						placeholder="me"
					/>

					<Button size="icon" variant="outline" type="submit" disabled={!!setDisplayName.pending}>
						{#if !!setDisplayName.pending}
							<Spinner />
						{:else}
							<Save />
						{/if}
					</Button>
				</ButtonGroup>

				<InputErrors
					name={setDisplayName.fields.displayName.as("text").name}
					errors={toErrors(
						setDisplayName.fields.displayName.issues()?.map((value) => value.message) ?? []
					)}
				/>
			</div>
		</form>
	</CardContent>
</Card>

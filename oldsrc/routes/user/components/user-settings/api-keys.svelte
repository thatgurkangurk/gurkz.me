<script lang="ts">
	import {
		Card,
		CardContent,
		CardFooter,
		CardHeader,
		CardTitle
	} from "#lib/components/ui/card/index.js";
	import { Button, buttonVariants } from "#lib/components/ui/button/index.js";
	import { Separator } from "#lib/components/ui/separator/index.js";
	import * as AlertDialog from "#lib/components/ui/alert-dialog/index.js";
	import Trash2 from "@lucide/svelte/icons/trash-2";
	import { getApiKeys, createApiKey, deleteApiKey } from "#lib/api/api-key.remote.js";
	import { CreateNewApiKeySchema } from "#lib/schemas/api-key.js";
	import { Input } from "#lib/components/ui/input/index.js";
	import { Label } from "#lib/components/ui/label/index.js";
	import InputErrors from "#lib/components/form/input-errors.svelte";
	import { toErrors } from "#lib/utils/to-errors.js";
	import * as Alert from "#lib/components/ui/alert/index.js";
	import CheckCircle2Icon from "@lucide/svelte/icons/check-circle-2";
	import CopyIcon from "@lucide/svelte/icons/copy";
	import { Spinner } from "#lib/components/ui/spinner/index.js";

	const apiKeyPromise = $derived(getApiKeys());
	const apiKeys = $derived(await apiKeyPromise);
</script>

{#if createApiKey.result?.success}
	<Alert.Root class="border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20">
		<CheckCircle2Icon class="h-5 w-5 shrink-0 text-emerald-600" />

		<div class="flex w-full min-w-0 flex-col gap-2">
			<Alert.Title class="text-emerald-800 dark:text-emerald-400">
				successfully created a new api key
			</Alert.Title>

			<Alert.Description class="space-y-3">
				<p class="text-sm opacity-90">
					please copy your key now because
					<span class="font-semibold text-destructive">you won't be able to see it again.</span>
				</p>

				<div class="mt-2 flex items-center gap-2">
					<code
						class="relative min-w-0 flex-1 rounded border bg-muted px-2 py-[0.4rem] font-mono text-sm font-semibold break-all select-all"
					>
						{createApiKey.result.key}
					</code>

					<Button
						variant="outline"
						size="icon"
						class="shrink-0"
						onclick={() => navigator.clipboard.writeText(createApiKey.result?.key || "")}
					>
						<CopyIcon class="h-4 w-4" />
					</Button>
				</div>
			</Alert.Description>
		</div>
	</Alert.Root>
{/if}

<Card class="w-full max-w-xl">
	<CardHeader>
		<CardTitle>api keys</CardTitle>
	</CardHeader>
	<CardContent class="flex gap-2">
		<div class="grid grid-cols-1 gap-4">
			{#each apiKeys.apiKeys as apiKey (apiKey.id)}
				{const deleteForm = deleteApiKey.for(apiKey.id)}
				<div class="flex flex-row items-center gap-2">
					<p>{apiKey.name} - {apiKey.start}...</p>
					<AlertDialog.Root>
						<AlertDialog.Trigger class={buttonVariants({ variant: "destructive", size: "icon" })}>
							<Trash2 />
						</AlertDialog.Trigger>
						<AlertDialog.Content>
							<AlertDialog.Header>
								<AlertDialog.Title
									>are you sure you want to delete this api key ({apiKey.name})?</AlertDialog.Title
								>
								<AlertDialog.Description>this api key will become unusable</AlertDialog.Description>
							</AlertDialog.Header>
							<AlertDialog.Footer>
								<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
								<form {...deleteForm}>
									<input {...deleteForm.fields.keyId.as("hidden", apiKey.id)} />

									<AlertDialog.Action
										disabled={deleteForm.pending > 0}
										type="submit"
										class={buttonVariants({ variant: "destructive" })}
									>
										{#if deleteForm.pending > 0}
											<Spinner />
										{/if}
										Continue
									</AlertDialog.Action>
								</form>
							</AlertDialog.Footer>
						</AlertDialog.Content>
					</AlertDialog.Root>
				</div>
			{/each}
			<Separator />

			<form
				{...createApiKey.preflight(CreateNewApiKeySchema)}
				oninput={() => createApiKey.validate({ all: false, preflightOnly: true })}
				enctype="multipart/form-data"
			>
				<div>
					<Label class={[!!createApiKey.fields.name.issues() && "text-destructive", "pb-2"]}
						>name</Label
					>
					<Input
						{...createApiKey.fields.name.as("text")}
						aria-errormessage="{createApiKey.fields.name.as('text').name}-error"
						aria-invalid={!!createApiKey.fields.name.issues()}
						placeholder="my api key"
					/>

					<InputErrors
						name={createApiKey.fields.name.as("text").name}
						errors={toErrors(
							createApiKey.fields.name.issues()?.map((value) => value.message) ?? []
						)}
					/>
				</div>

				<br />

				<Button type="submit" disabled={!!createApiKey.pending}>create</Button>
			</form>
		</div>
	</CardContent>
	<CardFooter>
		<p class="text-sm">
			this is basically only used for ttcore-clip-preparer, and you most likely won't use this.
		</p>
	</CardFooter>
</Card>

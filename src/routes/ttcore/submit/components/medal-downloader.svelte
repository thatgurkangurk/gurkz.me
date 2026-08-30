<script lang="ts">
	import { medalDownloader } from "#lib/api/ttcore/medal.remote.js";
	import { Input } from "#lib/components/ui/input/index.js";
	import { Label } from "#lib/components/ui/label/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import InputErrors from "#lib/components/form/input-errors.svelte";
	import { toErrors } from "#lib/utils/to-errors.js";
	import { MedalDownloaderSchema } from "#lib/schemas/medal-downloader.js";
	import { Download, LoaderCircle } from "@lucide/svelte";
	import ButtonGroup from "#lib/components/ui/button-group/button-group.svelte";
</script>

<form
	{...medalDownloader.preflight(MedalDownloaderSchema)}
	oninput={() => medalDownloader.validate({ includeUntouched: false, preflightOnly: true })}
	enctype="multipart/form-data"
	class="max-w-xl space-y-1.5 pt-2"
>
	<Label
		class={["text-xs font-medium", !!medalDownloader.fields.url.issues() && "text-destructive"]}
	>
		medal clip url
	</Label>

	<ButtonGroup class="w-full">
		<Input
			{...medalDownloader.fields.url.as("url")}
			aria-errormessage="{medalDownloader.fields.url.as('url').name}-error"
			aria-invalid={!!medalDownloader.fields.url.issues()}
			placeholder="https://medal.tv/games/..."
			class="h-10 rounded-r-none border-r-0"
		/>

		<Button
			type="submit"
			disabled={!!medalDownloader.pending}
			class="h-10 shrink-0 gap-2 rounded-l-none px-5"
		>
			{#if medalDownloader.pending}
				<LoaderCircle class="h-4 w-4 animate-spin" />
				<span>downloading...</span>
			{:else}
				<Download class="h-4 w-4" />
				<span>download</span>
			{/if}
		</Button>
	</ButtonGroup>

	<InputErrors
		name={medalDownloader.fields.url.as("url").name}
		errors={toErrors(medalDownloader.fields.url.issues()?.map((value) => value.message) ?? [])}
	/>
</form>

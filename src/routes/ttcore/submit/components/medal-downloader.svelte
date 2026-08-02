<script lang="ts">
	import { medalDownloader } from "$lib/api/ttcore/medal.remote.js";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Button } from "$lib/components/ui/button";
	import InputErrors from "$lib/components/form/input-errors.svelte";
	import { toErrors } from "$lib/utils/to-errors";
	import { MedalDownloaderSchema } from "$lib/schemas/medal-downloader";
</script>

<form
	class="py-2"
	{...medalDownloader.preflight(MedalDownloaderSchema)}
	oninput={() => medalDownloader.validate({ includeUntouched: false, preflightOnly: true })}
	enctype="multipart/form-data"
>
	<div>
		<Label class={[!!medalDownloader.fields.url.issues() && "text-destructive", "pb-2"]}>url</Label>
		<Input
			{...medalDownloader.fields.url.as("url")}
			aria-errormessage="{medalDownloader.fields.url.as('url').name}-error"
			aria-invalid={!!medalDownloader.fields.url.issues()}
			placeholder="https://medal.tv/games/..."
		/>

		<InputErrors
			name={medalDownloader.fields.url.as("url").name}
			errors={toErrors(medalDownloader.fields.url.issues()?.map((value) => value.message) ?? [])}
		/>
	</div>

	<br />

	<Button type="submit" disabled={!!medalDownloader.pending}>download</Button>
</form>

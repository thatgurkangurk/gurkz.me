<script lang="ts">
	import { resolve } from "$app/paths";
	import { Button } from "#lib/components/ui/button/index.js";
	import SubmitForm from "../components/submit-form.svelte";
	import type { PageProps } from "./$types";
	import { Alert, AlertDescription, AlertTitle } from "#lib/components/ui/alert/index.js";
	import CircleQuestionMark from "@lucide/svelte/icons/circle-question-mark";
	import CircleAlert from "@lucide/svelte/icons/circle-alert";
	import MedalDownloader from "../components/medal-downloader.svelte";
	import VideoUploader from "#lib/components/ttcore/video-uploader.svelte";
	import { getDateOfLastSubmissionForVideoByCurrentUser } from "#lib/api/ttcore/videos.remote.js";
	import {
		Card,
		CardContent,
		CardFooter,
		CardHeader,
		CardTitle
	} from "#lib/components/ui/card/index.js";

	import {
		Breadcrumb,
		BreadcrumbItem,
		BreadcrumbLink,
		BreadcrumbList,
		BreadcrumbSeparator,
		BreadcrumbPage
	} from "#lib/components/ui/breadcrumb/index.js";

	let { data }: PageProps = $props();

	let isMessageDismissed = $state(false);
</script>

<Breadcrumb>
	<BreadcrumbList>
		<BreadcrumbItem>
			<BreadcrumbLink href="/">home</BreadcrumbLink>
		</BreadcrumbItem>
		<BreadcrumbSeparator />
		<BreadcrumbItem>
			<BreadcrumbLink href="/ttcore">traitor town core</BreadcrumbLink>
		</BreadcrumbItem>
		<BreadcrumbSeparator />
		<BreadcrumbItem>
			<BreadcrumbPage>{data.details.title}</BreadcrumbPage>
		</BreadcrumbItem>
	</BreadcrumbList>
</Breadcrumb>

<Button href={resolve("ttcore")}>go back</Button>

{#if data.details.submissionsOpen}
	<div class="mx-auto max-w-4xl space-y-6 px-6 py-8 text-sm">
		<h1 class="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
			{data.details.title}
		</h1>

		<Alert class="p-4 sm:p-5">
			<CircleQuestionMark class="h-5 w-5" />
			<AlertTitle class="text-base font-semibold">do you have a clip on medal?</AlertTitle>
			<AlertDescription class="text-sm">
				use this to download it

				<div class="pt-3">
					<MedalDownloader />
				</div>
			</AlertDescription>
		</Alert>

		<VideoUploader />

		{#if data.details.message}
			<Alert variant="destructive" class="p-4 sm:p-5">
				<CircleAlert class="h-5 w-5" />
				<AlertTitle class="text-base font-semibold">read this first</AlertTitle>
				<AlertDescription class="text-sm leading-relaxed">
					{data.details.message}
				</AlertDescription>
			</Alert>

			{const date = await getDateOfLastSubmissionForVideoByCurrentUser(data.details.id)}

			{#if (!date || date < data.details.messageUpdatedAt!) && !isMessageDismissed}
				<Card class="border-destructive/40 bg-destructive/10">
					<CardHeader>
						<CardTitle class="text-base font-semibold text-foreground">
							please read the above message before submitting
						</CardTitle>
					</CardHeader>

					<CardContent class="text-sm leading-relaxed text-muted-foreground">
						the message has changed since you last visited this page, please go read it in case
						there is new important information. thank you
					</CardContent>

					<CardFooter class="bg-transparent">
						<Button size="sm" onclick={() => (isMessageDismissed = true)}>continue</Button>
					</CardFooter>
				</Card>
			{:else}
				<div class="pt-2">
					<SubmitForm videoId={data.details.id} />
				</div>
			{/if}
		{:else}
			<div class="pt-2">
				<SubmitForm videoId={data.details.id} />
			</div>
		{/if}
	</div>
{:else}
	<div class="mx-auto max-w-4xl space-y-6 px-6 py-8 text-sm">
		<div class="space-y-6 rounded-xl border bg-card p-6 shadow-sm sm:p-8">
			<h1 class="text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl">
				sorry, but submissions are not open at the moment, please check back later !
			</h1>

			{#if data.submitters.length > 0}
				<div class="space-y-4 border-t border-border/60 pt-2">
					<p class="font-medium text-muted-foreground">
						but thank you to all of these amazing people who submitted for <span
							class="font-semibold text-foreground">{data.details.title}</span
						>:
					</p>

					<ul class="grid grid-cols-1 gap-2.5 text-xs sm:grid-cols-2 md:grid-cols-3">
						{#each data.submitters as submitter (submitter.id)}
							<li
								class={[
									"flex items-center gap-1.5 rounded-lg border bg-muted/30 px-3 py-2 text-foreground/90",
									submitter.isOverridden && "text-muted-foreground italic"
								]}
							>
								<span class="truncate font-medium">{submitter.line1}</span>
								<span class="text-muted-foreground">-</span>
								<span class="truncate text-muted-foreground">{submitter.line2}</span>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
	</div>
{/if}

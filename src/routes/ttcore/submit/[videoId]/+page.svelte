<script lang="ts">
	import { resolve } from "$app/paths";
	import { Button } from "$lib/components/ui/button/index.js";
	import SubmitForm from "../components/submit-form.svelte";
	import type { PageProps } from "./$types";
	import { Alert, AlertDescription, AlertTitle } from "$lib/components/ui/alert/index.js";
	import CircleQuestionMark from "@lucide/svelte/icons/circle-question-mark";
	import CircleAlert from "@lucide/svelte/icons/circle-alert";
	import MedalDownloader from "../components/medal-downloader.svelte";
	import { getDateOfLastSubmissionForVideoByCurrentUser } from "$lib/api/ttcore/videos.remote.js";
	import {
		Card,
		CardContent,
		CardFooter,
		CardHeader,
		CardTitle
	} from "$lib/components/ui/card/index.js";
	import {
		Breadcrumb,
		BreadcrumbItem,
		BreadcrumbLink,
		BreadcrumbList,
		BreadcrumbSeparator,
		BreadcrumbPage
	} from "$lib/components/ui/breadcrumb/index.js";

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

<Button href={resolve("/ttcore")}>go back</Button>

{#if data.details.submissionsOpen}
	<h1 class="text-2xl font-bold tracking-tight md:text-3xl">
		{data.details.title}
	</h1>

	<Alert>
		<CircleQuestionMark />
		<AlertTitle>do you have a clip on medal?</AlertTitle>
		<AlertDescription>
			use this to download it

			<div class="py-2 text-white">
				<MedalDownloader />
			</div>
		</AlertDescription>
	</Alert>

	{#if data.details.message}
		<br />
		<Alert variant="destructive">
			<CircleAlert />
			<AlertTitle>read this first</AlertTitle>
			<AlertDescription>
				{data.details.message}
			</AlertDescription>
		</Alert>

		{const date = await getDateOfLastSubmissionForVideoByCurrentUser(data.details.id)}

		{#if (!date || date < data.details.messageUpdatedAt!) && !isMessageDismissed}
			<br />
			<Card>
				<CardHeader>
					<CardTitle>please read the above message before submitting</CardTitle>
				</CardHeader>
				<CardContent
					>the message has changed since you last visited this page, please go read it in case there
					is new important information. thank you
				</CardContent>

				<CardFooter>
					<Button onclick={() => (isMessageDismissed = true)}>continue</Button>
				</CardFooter>
			</Card>
		{:else}
			<div class="mt-6">
				<SubmitForm videoId={data.details.id} />
			</div>
		{/if}
	{:else}
		<div class="mt-6">
			<SubmitForm videoId={data.details.id} />
		</div>
	{/if}
{:else}
	<h1 class="text-3xl font-bold tracking-tight md:text-4xl">
		sorry, but submissions are not open at the moment, please check back later !
	</h1>

	{#if data.submitters.length > 0}
		<br />
		<p class="font-bold">
			but thank you to all of these amazing people who submitted for {data.details.title}:
		</p>

		<ul class="pl-2">
			{#each data.submitters as submitter (submitter.id)}
				<li class={[submitter.isOverridden && "italic"]}>
					{submitter.line1} -
					<span>{submitter.line2}</span>
				</li>
			{/each}
		</ul>
	{/if}
{/if}

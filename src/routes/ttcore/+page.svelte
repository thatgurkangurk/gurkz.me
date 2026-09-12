<script lang="ts">
	import { getVideos } from "#lib/api/ttcore/videos.remote.js";
	import Check from "#lib/components/check-with-pending.svelte";
	import {
		Breadcrumb,
		BreadcrumbItem,
		BreadcrumbLink,
		BreadcrumbList,
		BreadcrumbPage,
		BreadcrumbSeparator
	} from "#lib/components/ui/breadcrumb/index.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import {
		Card,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from "#lib/components/ui/card/index.js";

	import { resolve } from "$app/paths";
	import { ArrowRight, ShieldCheck, Video } from "@lucide/svelte";

	const videos = $derived(await getVideos());

	const openVideos = $derived(videos.filter((v) => v.submissionsOpen));
	const closedVideos = $derived(videos.filter((v) => !v.submissionsOpen));
</script>

<div class="flex max-w-2xl flex-col gap-6">
	<Breadcrumb>
		<BreadcrumbList>
			<BreadcrumbItem>
				<BreadcrumbLink href="/">home</BreadcrumbLink>
			</BreadcrumbItem>
			<BreadcrumbSeparator />
			<BreadcrumbItem>
				<BreadcrumbPage>traitor town core</BreadcrumbPage>
			</BreadcrumbItem>
		</BreadcrumbList>
	</Breadcrumb>

	<h1 class="text-3xl font-bold tracking-tight lowercase md:text-4xl">traitor town core</h1>

	<Check path="ttcore.manage">
		<Card class="max-w-xs">
			<CardHeader>
				<CardTitle class="flex items-center gap-2 lowercase">
					<ShieldCheck class="size-4" />
					ttcore admin
				</CardTitle>
				<CardDescription class="lowercase">you can manage ttcore submissions !</CardDescription>
			</CardHeader>
			<CardFooter>
				<Button href="/ttcore/admin" variant="outline" class="gap-2 lowercase">
					manage submissions
					<ArrowRight class="size-4" />
				</Button>
			</CardFooter>
		</Card>
	</Check>

	<section class="flex flex-col gap-3">
		<p class="text-sm font-medium text-muted-foreground lowercase">open submissions</p>

		<div class="align-start flex flex-col gap-2">
			{#each openVideos as video (video.id)}
				<Button
					variant="outline"
					class="w-full max-w-md justify-between lowercase"
					href={resolve("/ttcore/submit/[videoId]", { videoId: video.id })}
				>
					<span class="flex items-center gap-2 truncate">
						<Video class="size-4 shrink-0 text-muted-foreground" />
						{video.title}
					</span>
					<ArrowRight class="size-4 shrink-0 text-muted-foreground" />
				</Button>
			{:else}
				<p class="text-sm text-muted-foreground lowercase">
					no clip submissions are open at the moment !
				</p>
			{/each}
		</div>
	</section>

	{#if closedVideos.length > 0}
		<section class="flex flex-col gap-3">
			<div>
				<p class="text-sm font-medium text-muted-foreground lowercase">closed submissions</p>
				<p class="text-xs text-muted-foreground/70 lowercase">
					you can view these to see who submitted to them
				</p>
			</div>

			<div class="align-start flex flex-col gap-2">
				{#each closedVideos as video (video.id)}
					<Button
						variant="secondary"
						class="w-full max-w-md justify-between lowercase opacity-80"
						href={resolve("/ttcore/submit/[videoId]", { videoId: video.id })}
					>
						<span class="flex items-center gap-2 truncate">
							<Video class="size-4 shrink-0 text-muted-foreground" />
							{video.title}
						</span>
						<ArrowRight class="size-4 shrink-0 text-muted-foreground" />
					</Button>
				{/each}
			</div>
		</section>
	{/if}
</div>

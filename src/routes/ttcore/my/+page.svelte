<script lang="ts">
	import { getVideosWithMySubmissions } from "#lib/api/ttcore/videos.remote.js";
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
	import { ArrowRight, ShieldCheck, Video, CircleUserRound } from "@lucide/svelte";

	const videos = $derived((await getVideosWithMySubmissions()).filter((v) => !v.hidden));

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
				<BreadcrumbLink href="/ttcore">traitor town core</BreadcrumbLink>
			</BreadcrumbItem>
			<BreadcrumbSeparator />
			<BreadcrumbItem>
				<BreadcrumbPage>my submissions</BreadcrumbPage>
			</BreadcrumbItem>
		</BreadcrumbList>
	</Breadcrumb>

	<h1 class="text-3xl font-bold tracking-tight lowercase md:text-4xl">my tt core submissions</h1>

	<section class="flex flex-col gap-3">
		<p class="text-sm font-medium text-muted-foreground lowercase">open submissions</p>

		<div class="align-start flex flex-col gap-2">
			{#each openVideos as video (video.id)}
				<Button
					variant="outline"
					class="w-full max-w-md justify-between lowercase"
					href={resolve("/ttcore/my/[videoId]", { videoId: video.id })}
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
			</div>

			<div class="align-start flex flex-col gap-2">
				{#each closedVideos as video (video.id)}
					<Button
						variant="secondary"
						class="w-full max-w-md justify-between lowercase opacity-80"
						href={resolve("/ttcore/my/[videoId]", { videoId: video.id })}
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

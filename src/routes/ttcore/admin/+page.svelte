<script lang="ts">
	import { getVideos } from "#lib/api/ttcore/videos.remote.js";
	import { Badge } from "#lib/components/ui/badge/index.js";
	import {
		Breadcrumb,
		BreadcrumbItem,
		BreadcrumbLink,
		BreadcrumbList,
		BreadcrumbPage,
		BreadcrumbSeparator
	} from "#lib/components/ui/breadcrumb/index.js";
	import { Button } from "#lib/components/ui/button/index.js";

	import { resolve } from "$app/paths";
	import { ArrowLeft, ArrowRight, Video } from "@lucide/svelte";

	const videos = $derived(
		(await getVideos()).toSorted((a, b) => Number(b.submissionsOpen) - Number(a.submissionsOpen))
	);

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
				<BreadcrumbPage>admin</BreadcrumbPage>
			</BreadcrumbItem>
		</BreadcrumbList>
	</Breadcrumb>

	<div class="flex flex-col gap-2">
		<Button variant="outline" size="sm" href={resolve("ttcore")} class="w-fit justify-start gap-2 ">
			<ArrowLeft class="size-4" />
			<span>go back</span>
		</Button>

		<div class="space-y-1">
			<h1 class="text-3xl font-bold tracking-tight md:text-4xl">tt core admin</h1>
			<p class="text-sm text-muted-foreground">all video submissions</p>
		</div>
	</div>

	<section class="flex flex-col gap-3">
		<p class="text-sm font-medium text-muted-foreground">open submissions</p>

		<div class="align-start flex flex-col gap-2">
			{#each openVideos as video (video.id)}
				<Button
					variant="outline"
					class="w-full max-w-md justify-between gap-3 "
					href={resolve("/ttcore/admin/[videoId]", { videoId: video.id })}
				>
					<span class="flex min-w-0 items-center gap-2 truncate">
						<Video class="size-4 shrink-0 text-muted-foreground" />
						<span class="truncate">{video.title}</span>
					</span>
					<div class="ms-auto flex shrink-0 items-center gap-2">
						<Badge variant="default" class="">open</Badge>
						<ArrowRight class="size-4 text-muted-foreground" />
					</div>
				</Button>
			{:else}
				<p class="text-sm text-muted-foreground">no clip submissions are open at the moment !</p>
			{/each}
		</div>
	</section>

	{#if closedVideos.length > 0}
		<section class="flex flex-col gap-3">
			<div>
				<p class="text-sm font-medium text-muted-foreground">closed submissions</p>
			</div>

			<div class="align-start flex flex-col gap-2">
				{#each closedVideos as video (video.id)}
					<Button
						variant="secondary"
						class="w-full max-w-md justify-between gap-3  opacity-80"
						href={resolve("/ttcore/admin/[videoId]", { videoId: video.id })}
					>
						<span class="flex min-w-0 items-center gap-2 truncate">
							<Video class="size-4 shrink-0 text-muted-foreground" />
							<span class="truncate">{video.title}</span>
						</span>
						<div class="ms-auto flex shrink-0 items-center gap-2">
							<Badge variant="outline" class="">closed</Badge>
							<ArrowRight class="size-4 text-muted-foreground" />
						</div>
					</Button>
				{/each}
			</div>
		</section>
	{/if}
</div>

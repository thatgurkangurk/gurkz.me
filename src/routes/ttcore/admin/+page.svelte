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
	import { Card, CardContent } from "#lib/components/ui/card/index.js";

	import { resolve } from "$app/paths";
	import { ArrowLeft, ArrowRight, Video } from "@lucide/svelte";

	const videos = $derived(
		(await getVideos()).toSorted((a, b) => Number(b.submissionsOpen) - Number(a.submissionsOpen))
	);
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
			<BreadcrumbPage>admin</BreadcrumbPage>
		</BreadcrumbItem>
	</BreadcrumbList>
</Breadcrumb>

<div class="w-full space-y-6 p-6">
	<Button variant="outline" size="sm" href={resolve("ttcore")} class="w-fit justify-start gap-2">
		<ArrowLeft class="size-4" />
		<span>go back</span>
	</Button>

	<header class="space-y-1">
		<h1 class="text-3xl font-bold tracking-tight md:text-4xl">tt core admin</h1>
		<p class="text-sm text-muted-foreground lowercase">all video submissions</p>
	</header>

	<section class="space-y-3">
		<div class="grid gap-3">
			{#each videos as video (video.id)}
				<a href={resolve("/ttcore/admin/[videoId]", { videoId: video.id })}>
					<Card class="transition-all hover:bg-accent/50 hover:border-foreground/20">
						<CardContent class="flex items-center justify-between p-4">
							<div class="flex items-center gap-3 min-w-0">
								<div class="rounded-md bg-muted p-2 text-muted-foreground">
									<Video class="size-4" />
								</div>
								<div class="flex flex-col gap-0.5 min-w-0">
									<span class="truncate text-sm font-medium lowercase">
										{video.title}
									</span>
									<span class="text-xs text-muted-foreground lowercase">
										{video.submissionsOpen ? "open" : "closed"}
									</span>
								</div>
							</div>

							<div class="flex items-center gap-3 shrink-0 ml-4">
								<Badge variant={video.submissionsOpen ? "default" : "secondary"} class="lowercase">
									{video.submissionsOpen ? "active" : "closed"}
								</Badge>
								<ArrowRight class="size-4 text-muted-foreground" />
							</div>
						</CardContent>
					</Card>
				</a>
			{:else}
				<Card class="border-dashed">
					<CardContent class="flex flex-col items-center justify-center p-8 text-center">
						<Video class="size-8 text-muted-foreground/60 mb-2" />
						<p class="text-sm text-muted-foreground lowercase">
							no clip submissions are open at the moment !
						</p>
					</CardContent>
				</Card>
			{/each}
		</div>
	</section>
</div>

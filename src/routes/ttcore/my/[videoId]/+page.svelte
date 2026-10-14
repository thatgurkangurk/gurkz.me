<script lang="ts">
	import { getMyClipsForVideo, getVideoById } from "#lib/api/ttcore/videos.remote.js";
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
	import type { PageProps } from "./$types";
	import ClipCard from "#lib/components/ttcore/clip-card.svelte";
	import { MetaTags } from "svelte-meta-tags";

	const { params }: PageProps = $props();

	const videoDetails = $derived(
		await getVideoById({
			videoId: params.videoId
		})
	);
</script>

<MetaTags
	title="{videoDetails.title} - my submissions - ttcore"
	titleTemplate="%s - gurkan's website"
/>

<div class="flex max-w-2xl flex-col gap-6">
	<Breadcrumb>
		<BreadcrumbList>
			<BreadcrumbItem>
				<BreadcrumbLink href="/">home</BreadcrumbLink>
			</BreadcrumbItem>
			<BreadcrumbSeparator />
			<BreadcrumbItem>
				<BreadcrumbLink href="/ttcore">ttcore</BreadcrumbLink>
			</BreadcrumbItem>
			<BreadcrumbSeparator />
			<BreadcrumbItem>
				<BreadcrumbLink href="/ttcore/my">my submissions</BreadcrumbLink>
			</BreadcrumbItem>
			<BreadcrumbSeparator />
			<BreadcrumbItem>
				<BreadcrumbPage>{videoDetails.title}</BreadcrumbPage>
			</BreadcrumbItem>
		</BreadcrumbList>
	</Breadcrumb>

	<Button class="w-fit" href={resolve("/ttcore/my")}>go back</Button>

	<h1 class="text-2xl font-bold tracking-tight lowercase md:text-3xl">
		my submissions for {videoDetails.title}
	</h1>

	<section class="flex flex-col gap-3">
		<div class="w-full py-4">
			<div
				class="grid w-full grid-cols-1 gap-8 transition-all duration-300 ease-out sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
			>
				{#each await getMyClipsForVideo({ videoId: params.videoId }) as clip (clip.id)}
					<ClipCard {clip} />
				{/each}
			</div>
		</div>
	</section>
</div>

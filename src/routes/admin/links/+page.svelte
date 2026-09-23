<script>
	import { listShortLinks } from "#lib/api/short-links.remote.js";
	import {
		Breadcrumb,
		BreadcrumbItem,
		BreadcrumbLink,
		BreadcrumbList,
		BreadcrumbPage,
		BreadcrumbSeparator
	} from "#lib/components/ui/breadcrumb/index.js";
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from "#lib/components/ui/card/index.js";
	import CreateNewLink from "./create-new-link.svelte";
</script>

<Breadcrumb>
	<BreadcrumbList>
		<BreadcrumbItem>
			<BreadcrumbLink href="/">home</BreadcrumbLink>
		</BreadcrumbItem>
		<BreadcrumbSeparator />
		<BreadcrumbItem>
			<BreadcrumbLink href="/admin">short links</BreadcrumbLink>
		</BreadcrumbItem>
		<BreadcrumbSeparator />
		<BreadcrumbItem>
			<BreadcrumbPage>users</BreadcrumbPage>
		</BreadcrumbItem>
	</BreadcrumbList>
</Breadcrumb>

<h1 class="text-3xl font-bold tracking-tight md:text-4xl">all short links</h1>

<CreateNewLink />

<div class="grid grid-cols-1 gap-4 pt-4 md:grid-cols-3">
	{#each await listShortLinks() as shortLink (shortLink.id)}
		<Card class="flex h-full flex-col">
			<CardHeader class="flex flex-row items-center gap-4 space-y-0">
				<CardTitle>{shortLink.title} (slug: {shortLink.slug}, uses: {shortLink.uses})</CardTitle>
			</CardHeader>

			<CardContent class="flex-1">
				{shortLink.location}
			</CardContent>

			<CardFooter>
				<div
					class="flex w-full items-center justify-between pt-1 text-[10px] text-muted-foreground/50"
				>
					<span>id</span>
					<code class="truncate pl-4 font-mono text-[10px] select-all" title={shortLink.id}>
						{shortLink.id ?? ""}
					</code>
				</div>
			</CardFooter>
		</Card>
	{/each}
</div>

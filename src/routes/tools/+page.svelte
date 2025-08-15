<script>
	import Meta from "$lib/components/meta.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
		CardDescription
	} from "$lib/components/ui/card";
	import { TOOLS } from "$lib/tools";
</script>

<Meta title="tools" />

<h1 class="text-3xl">random tools</h1>

<div class="grid grid-cols-2 gap-2">
	{#each TOOLS as tool}
		<Card class="w-full max-w-xs">
			<CardHeader>
				<CardTitle>{tool.title}</CardTitle>
			</CardHeader>
			<CardContent>
				<CardDescription>{tool.description}</CardDescription>
				<Button href="/tools/{tool.slug}">open</Button>
			</CardContent>
		</Card>
	{/each}
</div>

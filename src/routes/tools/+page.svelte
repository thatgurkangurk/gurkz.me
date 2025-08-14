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
</script>

<Meta title="tools" />

<h1 class="text-3xl">random tools</h1>

<div class="grid grid-cols-2 gap-2">
	<Card class="w-full max-w-xs">
		<CardHeader>
			<CardTitle>jester's cipher</CardTitle>
		</CardHeader>
		<CardContent>
			<CardDescription>a random cipher tool by KiwiMan</CardDescription>
			<Button href="/cipher">open</Button>
		</CardContent>
	</Card>
	<Card class="w-full max-w-xs">
		<CardHeader>
			<CardTitle>webhook destroyer</CardTitle>
		</CardHeader>
		<CardContent>
			<CardDescription>destroy discord webhooks with ease</CardDescription>
			<Button href="/tools/webhook-destroyer">open</Button>
		</CardContent>
	</Card>
</div>

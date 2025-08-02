<script>
	import Button from "$lib/components/ui/button/button.svelte";
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
		CardDescription
	} from "$lib/components/ui/card";
</script>

<h1 class="text-3xl">random tools</h1>

<div class="grid grid-cols-2">
	<Card class="w-full max-w-xs">
		<CardHeader>
			<CardTitle>jester's cipher</CardTitle>
		</CardHeader>
		<CardContent>
			<CardDescription>a random cipher tool by KiwiMan</CardDescription>
			<Button href="/cipher">open</Button>
		</CardContent>
	</Card>
</div>

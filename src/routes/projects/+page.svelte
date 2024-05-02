<script lang="ts">
	import { projects } from "$lib/projects";
	import * as Card from "$lib/components/ui/card";
	import Button from "$lib/components/ui/button/button.svelte";
</script>

<svelte:head>
	<title>projects - gurkan's website</title>
</svelte:head>

<h2 class="text-3xl pb-3">projects</h2>

<div class="grid gap-2 grid-cols-2 md:grid-cols-4">
	{#each projects as project}
		<Card.Root>
			<Card.Header>
				<Card.Title>{project.title}</Card.Title>
			</Card.Header>
			<Card.Content>
				<p>{project.description}</p>
			</Card.Content>
			<Card.Footer>
				<Button href={`/project${project.slug}`}>open</Button>
			</Card.Footer>
		</Card.Root>
	{/each}
</div>

<script lang="ts">
	import { Alert, AlertTitle, AlertDescription } from "$lib/components/ui/alert";
	import { OctagonAlert } from "lucide-svelte";
	import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { projects, type Project } from "./projects";
</script>

<h1 class="text-3xl">projects</h1>

{#snippet projectCard(project: Project)}
	<Card>
		<CardHeader>
			<CardTitle>{project.title}</CardTitle>
		</CardHeader>
		<CardContent>
			<p>{project.description}</p>
		</CardContent>
		<CardFooter>
			<Button variant="default" href={`/project/${project.slug}`}>open</Button>
		</CardFooter>
	</Card>
{/snippet}

<noscript>
	<Alert variant={"destructive"}>
		<OctagonAlert class="h-4 w-4" />
		<AlertTitle>warning</AlertTitle>
		<AlertDescription>most (if not all) of these require JavaScript</AlertDescription>
	</Alert>
</noscript>

<div class="grid gap-2 grid-cols-2 md:grid-cols-4">
	{#each projects as project}
		{@render projectCard(project)}
	{/each}
</div>

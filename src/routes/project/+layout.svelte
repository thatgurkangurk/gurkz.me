<script lang="ts">
	import { page } from "$app/stores";
	import Button from "$lib/components/ui/button/button.svelte";
	import { getProjectBySlug } from "$lib/projects";
	import { error } from "@sveltejs/kit";
	import { ArrowLeftIcon } from "lucide-svelte";

	const slug = $page.url.pathname.replace("/project", "");

	const project = getProjectBySlug(slug);

	if (!project) error(404, "not found");
</script>

<Button href="/projects"><ArrowLeftIcon class="mr-2 h-6 w-6" /> back</Button>

<h2 class="text-3xl">{project.title}</h2>
<p>{project.description}</p>

<slot />

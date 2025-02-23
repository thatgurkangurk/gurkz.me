<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { ArrowLeftIcon } from "lucide-svelte";
	import type { LayoutProps } from "./$types";

	let { data, children }: LayoutProps = $props();
</script>

<Button href="/projects">
	<ArrowLeftIcon class="mr-2 h-6 w-6 " />back
</Button>
<h2 class="text-3xl">{data.project.title}</h2>
<p>{data.project.description}</p>
{@render children()}

<script lang="ts">
	import { page } from "$app/stores";
	import { Button } from "$lib/components/ui/button";
</script>

<h1 class="text-3xl">{$page.status}: {$page.error!.message}</h1>

<Button href="/projects">go back to the project list</Button>

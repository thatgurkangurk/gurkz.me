<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import { Skeleton } from "$lib/components/ui/skeleton";
	import { LoaderCircle } from "lucide-svelte";
</script>

<Card.Root class="w-full h-full">
	<Card.Header>
		<Card.Title class="text-xl pt-1">
			<Skeleton class="h-6 w-2 sm:w-48 md:w-48 lg:w-60" />
		</Card.Title>
	</Card.Header>
	<Card.Content class="flex items-center text-xl gap-2 pt-3">
		<Skeleton class="h-6 w-2 sm:w-32 md:w-32 lg:w-48" />
		<Skeleton class="h-6 w-6" />
	</Card.Content>
	<Card.Footer class="grid grid-cols-1 gap-1">
		<Skeleton class="h-10" />
		<Skeleton class="h-6 w-[95%]" />
	</Card.Footer>
	<div class="p-2"><LoaderCircle class="h-6 w-6 animate-spin" /></div>
</Card.Root>

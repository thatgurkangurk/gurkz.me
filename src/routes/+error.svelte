<script lang="ts">
	import { page } from "$app/state";
	import { Button } from "$lib/components/ui/button";
	import * as Empty from "$lib/components/ui/empty/index.js";
	import Bomb from "@lucide/svelte/icons/bomb";
</script>

<Empty.Root class="h-full bg-linear-to-b from-muted/50 from-30% to-background">
	<Empty.Header>
		<Empty.Media variant="icon">
			<Bomb />
		</Empty.Media>
		<Empty.Title>Error {page.status}</Empty.Title>
		<Empty.Description>{page.error?.message}</Empty.Description>
	</Empty.Header>
	<Empty.Content>
		<div class="flex gap-2">
			<Button href="/">go home</Button>
		</div>
	</Empty.Content>
</Empty.Root>

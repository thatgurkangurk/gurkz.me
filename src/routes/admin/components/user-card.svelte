<script lang="ts">
	import type { User } from "$lib/server/auth.js";
	import {
		Card,
		CardContent,
		CardFooter,
		CardHeader,
		CardTitle
	} from "$lib/components/ui/card/index.js";
	import { Button } from "$lib/components/ui/button";

	type Props = {
		user: User;
	};

	let { user }: Props = $props();
</script>

<Card class="h-full w-full">
	<CardHeader>
		<CardTitle class="text-xl">{user.name}</CardTitle>
	</CardHeader>
	<CardContent>
		<div class="text-md flex items-center gap-2">
			permissions: {user.permissions.join(", ")}
		</div>
	</CardContent>
	<CardFooter class="grid grid-cols-1 gap-1">
		<p>
			role: <span>{user.role}</span>
		</p>
		<Button class="w-fit" href="/admin/user/{user.id}">manage</Button>
	</CardFooter>
</Card>

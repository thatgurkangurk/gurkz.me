<script lang="ts">
	import type { getUsers } from "#lib/api/admin.remote.js";
	import Button from "#lib/components/ui/button/button.svelte";
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from "#lib/components/ui/card/index.js";
	import { ExternalLink } from "@lucide/svelte";
	import { Avatar, AvatarFallback, AvatarImage } from "#lib/components/ui/avatar/index.js";
	import { getInitials } from "#lib/utils/initials.js";
	import { resolve } from "$app/paths";

	type Props = {
		user: Awaited<ReturnType<typeof getUsers>>[0];
	};

	let { user }: Props = $props();
</script>

<Card class="flex h-full flex-col">
	<CardHeader class="flex flex-row items-center gap-4 space-y-0">
		<Avatar>
			<AvatarImage src={user.image} alt="{user.name} profile picture" />
			<AvatarFallback>{getInitials(user.name)}</AvatarFallback>
		</Avatar>
		<CardTitle>{user.name}</CardTitle>
	</CardHeader>

	<CardContent class="flex-1">
		{user.permissions.join(", ")}
	</CardContent>

	<CardFooter>
		<Button
			href={resolve("/admin/users/[userId]", {
				userId: user.id
			})}
		>
			manage
		</Button>
	</CardFooter>
</Card>

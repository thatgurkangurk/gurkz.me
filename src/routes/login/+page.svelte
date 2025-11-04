<script lang="ts">
	import * as Empty from "$lib/components/ui/empty/index.js";
	import { page } from "$app/state";
	import { signIn } from "$lib/auth.remote.js";
	import { Button } from "$lib/components/ui/button";
	import SquareUserRound from "@lucide/svelte/icons/square-user-round";

	const redirectTo = $derived(page.url.searchParams.get("redirectTo") ?? "/");
</script>

<Empty.Root class="h-full bg-linear-to-b from-muted/50 from-30% to-background">
	<Empty.Header>
		<Empty.Media variant="icon">
			<SquareUserRound />
		</Empty.Media>
		<Empty.Title>Please sign in</Empty.Title>
		<Empty.Description>
			Please sign in to access "{redirectTo}"
		</Empty.Description>
	</Empty.Header>
	<Empty.Content>
		<div class="flex gap-2">
			<form {...signIn.for("login_page")}>
				<input {...signIn.for("login_page").fields.provider.as("hidden", "discord")} />
				<input {...signIn.for("login_page").fields.redirectTo.as("hidden", redirectTo)} />
				<Button {...signIn.for("login_page").buttonProps}>log in</Button>
			</form>
		</div>
	</Empty.Content>
</Empty.Root>

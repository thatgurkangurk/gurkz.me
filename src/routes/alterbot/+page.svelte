<script lang="ts">
	import { Button } from "#lib/components/ui/button/index.js";
	import { Input } from "#lib/components/ui/input/index.js";
	import * as Card from "#lib/components/ui/card/index.js";
	import GuildViewer from "./bot.svelte";

	let baseUrl = $state("");
	let token = $state("");

	let activeConfig = $state<{ baseUrl: string; token: string } | null>(null);

	function handleConnect(e: SubmitEvent) {
		e.preventDefault();
		if (!baseUrl || !token) return;

		activeConfig = {
			baseUrl: baseUrl.trim(),
			token: token.trim()
		};
	}
</script>

<div class="mx-auto w-full max-w-lg space-y-4">
	<Card.Root>
		<Card.Header class="pb-3">
			<Card.Title class="text-base font-medium">connect to a bot</Card.Title>
			<Card.Description class="text-xs">enter a bot URL and bearer token to start</Card.Description>
		</Card.Header>
		<Card.Content>
			<form onsubmit={handleConnect} class="space-y-3">
				<div class="space-y-1.5">
					<label class="text-xs font-medium text-muted-foreground" for="base-url"> bot URL </label>
					<Input
						id="base-url"
						type="url"
						placeholder="https://my.alter.bot"
						bind:value={baseUrl}
						required
					/>
				</div>

				<div class="space-y-1.5">
					<label class="text-xs font-medium text-muted-foreground" for="bearer-token">
						bearer token
					</label>
					<Input
						id="bearer-token"
						type="password"
						placeholder="enter auth token"
						bind:value={token}
						required
					/>
				</div>

				<Button type="submit" disabled={!baseUrl || !token} class="w-full">connect</Button>
			</form>
		</Card.Content>
	</Card.Root>

	{#if activeConfig}
		<GuildViewer baseUrl={activeConfig.baseUrl} token={activeConfig.token} />
	{:else}
		<p class="text-center text-xs text-muted-foreground">not connected yet. enter details above.</p>
	{/if}
</div>

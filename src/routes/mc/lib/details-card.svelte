<script lang="ts">
	import { Card, CardHeader, CardTitle, CardContent } from "$lib/components/ui/card";
	import type { OnlineResponse } from "./types";

	type Props = {
		status: OnlineResponse;
	};

	let { status }: Props = $props();

	let showPlayers = $state(false);
</script>

<Card class="w-fit">
	<CardHeader class="flex flex-row items-center gap-2">
		<CardTitle>{status.hostname} status</CardTitle>
		<img src={`https://api.mcsrvstat.us/icon/${status.ip}`} class="w-8 h-8 rounded-md" />
	</CardHeader>
	<CardContent>
		<p>current players: <span>{status.players.online}/{status.players.max}</span></p>

		{#if showPlayers}
			<button
				onclick={() => {
					showPlayers = !showPlayers;
				}}>hide player list</button
			>
			<ul>
				{#each status.players.list! as player}
					<li>{player.name}</li>
				{/each}
			</ul>
		{:else}
			<button
				onclick={() => {
					showPlayers = !showPlayers;
				}}>show player list</button
			>
		{/if}

		<p>version: <span>{status.version}</span></p>
		<p>server software: <span>{status.software}</span></p>
		<p>MOTD: {@html status.motd.html}</p>
		<!-- TODO: this is technically unsafe, will fix later -->
	</CardContent>
</Card>

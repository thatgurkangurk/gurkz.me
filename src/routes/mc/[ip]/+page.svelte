<script lang="ts">
	import { Alert, AlertDescription, AlertTitle } from "$lib/components/ui/alert";
	import { OctagonX } from "lucide-svelte";
	import type { PageServerData } from "./$types";
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";

	type Props = {
		data: PageServerData;
	};

	let { data }: Props = $props();

	let showDebug = $state(true);
	let showPlayers = $state(false);
</script>

{#snippet tableRow(data: { title: string; text: string | undefined })}
	{#if data.text}
		<tr class="border-b-2">
			<td class="fw-normal border-r-2"><samp>{data.title}</samp></td>
			<td class="pl-2"><samp>{data.text}</samp></td>
		</tr>
	{/if}
{/snippet}

{#if data.status.online}
	<Card class="w-fit">
		<CardHeader class="flex flex-row items-center gap-2">
			<CardTitle>{data.status.hostname} status</CardTitle>
			<img src={`https://api.mcsrvstat.us/icon/${data.status.ip}`} class="w-8 h-8 rounded-md" />
		</CardHeader>
		<CardContent>
			<p>current players: <span>{data.status.players.online}/{data.status.players.max}</span></p>

			{#if showPlayers}
				<button
					onclick={() => {
						showPlayers = !showPlayers;
					}}>hide player list</button
				>
				<ul>
					{#each data.status.players.list! as player}
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

			<p>version: <span>{data.status.version}</span></p>
			<p>server software: <span>{data.status.software}</span></p>
			<p>MOTD: {@html data.status.motd.html}</p>
			<!-- TODO: this is technically unsafe, will fix later -->
		</CardContent>
	</Card>
{:else}
	<Alert class="w-fit" variant="destructive">
		<OctagonX class="h-4 w-4" />
		<AlertTitle>server offline or unreachable</AlertTitle>
		<AlertDescription
			>make sure you typed in the correct address or try again later
		</AlertDescription>
		<br />
		{#if showDebug}
			<button
				onclick={() => {
					showDebug = !showDebug;
				}}>hide debug information</button
			>
			<p class="pt-2">debug information:</p>
			<table class="table-auto">
				<thead class="border-b-2">
					<tr class="text-center">
						<th class="border-r-2">Type</th>
						<th>Error message</th>
					</tr>
				</thead>
				<tbody>
					{@render tableRow({ title: "Ping", text: data.status.debug.error?.ping })}
					{@render tableRow({ title: "Query", text: data.status.debug.error?.query })}
				</tbody>
			</table>
		{:else}
			<button
				onclick={() => {
					showDebug = !showDebug;
				}}>show debug information</button
			>
		{/if}
	</Alert>
{/if}

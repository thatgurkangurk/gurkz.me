<script lang="ts">
	import { createMutation, createQuery } from "@tanstack/svelte-query";
	import { Button } from "#lib/components/ui/button/index.js";
	import { Input } from "#lib/components/ui/input/index.js";
	import { NativeSelect } from "#lib/components/ui/native-select/index.js";
	import * as Card from "#lib/components/ui/card/index.js";
	import {
		guildChannelsQueryOptions,
		guildsQueryOptions,
		sendMessageMutationOptions
	} from "#lib/features/alterbot/queries.js";

	type Props = {
		baseUrl: string;
		token: string;
	};

	let { baseUrl, token }: Props = $props();

	let selectedGuildId = $state("");
	let selectedChannelId = $state("");
	let messageText = $state("");

	const requestOpts = $derived({ baseUrl, token });

	const guildsQuery = createQuery(() => guildsQueryOptions(requestOpts));
	const channelsQuery = createQuery(() => guildChannelsQueryOptions(selectedGuildId, requestOpts));

	const textChannels = $derived(
		channelsQuery.data?.filter((channel) => channel.kind === "Text") ?? []
	);

	const sendMessageMutation = createMutation(() =>
		sendMessageMutationOptions(selectedGuildId, requestOpts)
	);

	function handleSend(e: SubmitEvent) {
		e.preventDefault();
		if (!selectedGuildId || !selectedChannelId || !messageText.trim()) return;

		sendMessageMutation.mutate(
			{
				channel_id: selectedChannelId,
				message: messageText.trim()
			},
			{
				onSuccess: () => {
					messageText = "";
				}
			}
		);
	}
</script>

<div class="mx-auto w-full max-w-lg space-y-4">
	<Card.Root>
		<Card.Header class="pb-3">
			<Card.Title class="text-base font-medium">message sender</Card.Title>
			<Card.Description class="text-xs">select target guild and text channel</Card.Description>
		</Card.Header>
		<Card.Content class="grid gap-3 sm:grid-cols-2">
			<div class="space-y-1.5">
				<label class="text-xs font-medium text-muted-foreground" for="guild-select">guild</label>
				{#if guildsQuery.isLoading}
					<p class="text-xs text-muted-foreground">loading guilds...</p>
				{:else if guildsQuery.isError}
					<p class="text-xs text-destructive">error: {guildsQuery.error.type}</p>
				{:else if guildsQuery.data}
					<NativeSelect
						id="guild-select"
						bind:value={selectedGuildId}
						onchange={() => (selectedChannelId = "")}
					>
						<option value="">select a guild</option>
						{#each guildsQuery.data as guild (guild.id)}
							<option value={guild.id}>{guild.name}</option>
						{/each}
					</NativeSelect>
				{/if}
			</div>

			<div class="space-y-1.5">
				<label class="text-xs font-medium text-muted-foreground" for="channel-select">channel</label
				>
				{#if !selectedGuildId}
					<p class="text-xs text-muted-foreground">select guild first</p>
				{:else if channelsQuery.isLoading}
					<p class="text-xs text-muted-foreground">loading channels...</p>
				{:else if channelsQuery.isError}
					<p class="text-xs text-destructive">error: {channelsQuery.error.type}</p>
				{:else if textChannels.length > 0}
					<NativeSelect id="channel-select" bind:value={selectedChannelId}>
						<option value="">select a channel</option>
						{#each textChannels as channel (channel.id)}
							<option value={channel.id}>#{channel.name}</option>
						{/each}
					</NativeSelect>
				{:else}
					<p class="text-xs text-muted-foreground">no text channels</p>
				{/if}
			</div>
		</Card.Content>
	</Card.Root>

	{#if selectedGuildId && selectedChannelId}
		<Card.Root>
			<Card.Content class="p-4">
				<form onsubmit={handleSend} class="space-y-2">
					<div class="flex items-center gap-2">
						<Input
							type="text"
							placeholder="type message..."
							bind:value={messageText}
							disabled={sendMessageMutation.isPending}
							class="flex-1"
						/>
						<Button type="submit" disabled={!messageText.trim() || sendMessageMutation.isPending}>
							{sendMessageMutation.isPending ? "sending..." : "send"}
						</Button>
					</div>

					{#if sendMessageMutation.isError}
						<p class="text-xs text-destructive">
							error sending message: {sendMessageMutation.error.type}
						</p>
					{/if}
				</form>
			</Card.Content>
		</Card.Root>
	{/if}
</div>

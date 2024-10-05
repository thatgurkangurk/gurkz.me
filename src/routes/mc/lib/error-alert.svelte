<script lang="ts">
	import { Alert, AlertTitle, AlertDescription } from "$lib/components/ui/alert";
	import * as Table from "$lib/components/ui/table";
	import { OctagonX } from "lucide-svelte";

	type Error = {
		name: string;
		message?: string;
	};

	type Props = {
		errors: Error[];
	};

	let { errors }: Props = $props();
	let showDebug = $state(true);
</script>

<Alert class="w-fit" variant="destructive">
	<OctagonX class="h-4 w-4" />
	<AlertTitle>server offline or unreachable</AlertTitle>
	<AlertDescription>make sure you typed in the correct address or try again later</AlertDescription>
	<br />
	{#if showDebug}
		<button
			onclick={() => {
				showDebug = !showDebug;
			}}>hide debug information</button
		>
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-[100px]">Type</Table.Head>
					<Table.Head class="w-full">Message</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each errors as error (error)}
					{#if error.message}
						<Table.Row>
							<Table.Cell class="font-medium">{error.name}</Table.Cell>
							<Table.Cell>{error.message}</Table.Cell>
						</Table.Row>
					{/if}
				{/each}
			</Table.Body>
		</Table.Root>
	{:else}
		<button
			onclick={() => {
				showDebug = !showDebug;
			}}>show debug information</button
		>
	{/if}
</Alert>

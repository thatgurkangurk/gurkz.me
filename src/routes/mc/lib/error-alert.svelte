<script lang="ts">
	import { Alert, AlertTitle, AlertDescription } from "$lib/components/ui/alert";
	import { OctagonX } from "lucide-svelte";

	type Error = {
		name: string;
		message?: string;
	};

	type Props = {
		errors: Error[];
	};

	let { errors }: Props = $props();
	let showDebug = $state(false);
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
		<p class="pt-2">debug information:</p>
		<table class="table-auto">
			<thead class="border-b-2">
				<tr class="text-center">
					<th class="border-r-2">Type</th>
					<th>Error message</th>
				</tr>
			</thead>
			<tbody>
				{#each errors as error}
					{#if error.message}
						<tr class="border-b-2">
							<td class="fw-normal border-r-2"><samp>{error.name}</samp></td>
							<td class="pl-2"><samp>{error.message}</samp></td>
						</tr>
					{/if}
				{/each}
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

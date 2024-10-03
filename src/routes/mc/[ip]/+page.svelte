<script lang="ts">
	import type { PageServerData } from "./$types";
	import DetailsCard from "../lib/details-card.svelte";
	import ErrorAlert from "../lib/error-alert.svelte";

	type Props = {
		data: PageServerData;
	};

	let { data }: Props = $props();
</script>

{#if data.status.online}
	<DetailsCard status={data.status} />
{:else}
	<ErrorAlert
		errors={[
			{
				message: data.status.debug.error?.ping,
				name: "Ping",
			},
			{
				message: data.status.debug.error?.query,
				name: "Query",
			},
		]}
	/>
{/if}

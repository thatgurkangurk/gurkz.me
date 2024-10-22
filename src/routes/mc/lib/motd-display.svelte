<script lang="ts">
	type Props = {
		/**
		 * sanitised motd
		 */
		motd: string[];
	};

	let { motd }: Props = $props();
</script>

<div class="text-center block bg-black rounded text-white p-5 w-full overflow-x-auto">
	{#each motd as motdItem}
		<p>{@html motdItem}</p>
	{/each}
</div>

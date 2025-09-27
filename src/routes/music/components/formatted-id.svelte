<script lang="ts">
	import { IdFormatContext } from "../context";

	let { robloxId }: { robloxId: string } = $props();
	const ctx = IdFormatContext.get();
	const formattedId = $derived.by(() => {
		switch (ctx.current) {
			case "DEFAULT": {
				return robloxId;
			}
			case "TRAITOR_TOWN": {
				return `s/${robloxId}`;
			}
			default: {
				return robloxId;
			}
		}
	});
</script>

<span>{formattedId}</span>

<script lang="ts" module>
	import type { IdFormat } from "../context";
	export function formatId(robloxId: string, format: IdFormat = "DEFAULT") {
		switch (format) {
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
	}
</script>

<script lang="ts">
	import { IdFormatContext } from "../context";
	let { robloxId }: { robloxId: string } = $props();

	const format = IdFormatContext.get();

	const formattedId = $derived.by(() => formatId(robloxId, format.current));
</script>

<span>{formattedId}</span>

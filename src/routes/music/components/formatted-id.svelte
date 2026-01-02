<script lang="ts" module>
	import { CopyButton } from "$lib/components/ui/copy-button/index.js";
	import type { IdFormat } from "../context.js";
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
	import { getIdFormat } from "../context.js";
	let { robloxId }: { robloxId: string } = $props();

	const format = getIdFormat();

	const formattedId = $derived.by(() => formatId(robloxId, format.current));
</script>

<span>{formattedId}</span>
<CopyButton text={formattedId} variant={"outline"} />

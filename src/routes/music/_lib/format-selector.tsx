import { useMusicIdFormat } from "./format";

export function FormatSelector() {
	const ctx = useMusicIdFormat();
	return (
		<div class="flex gap-2 w-fit p-2 text-black">
			<button
				disabled={ctx.format() === "DEFAULT"}
				class="p-2 bg-green-200 disabled:bg-green-500"
				onClick={() => ctx.setFormat("DEFAULT")}
			>
				default
			</button>
			<button
				disabled={ctx.format() === "TRAITOR_TOWN"}
				class="p-2 bg-green-200 disabled:bg-green-500"
				onClick={() => ctx.setFormat("TRAITOR_TOWN")}
			>
				traitor
			</button>
		</div>
	);
}

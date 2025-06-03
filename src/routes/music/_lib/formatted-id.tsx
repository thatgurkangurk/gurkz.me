import type { MusicId } from "~/lib/schema/music";
import { useMusicIdFormat } from "./format";
import { createSignal, Show } from "solid-js";
import { Button } from "~/components/ui/button";
import Check from "lucide-solid/icons/check";
import Clipboard from "lucide-solid/icons/clipboard";

function CopyButton(props: { content: string }) {
	const ctx = useMusicIdFormat();
	const [copying, setCopying] = createSignal(false);
	return (
		<Button
			disabled={copying()}
			onClick={() => {
				setCopying(true);
				navigator.clipboard.writeText(ctx.formatId(props.content));
				setTimeout(() => {
					setCopying(false);
				}, 300);
			}}
			size="icon"
			variant="outline"
		>
			<Show when={copying()} fallback={<Clipboard />}>
				<Check />
			</Show>
		</Button>
	);
}

export function FormattedId(props: { musicId: MusicId }) {
	const ctx = useMusicIdFormat();
	return (
		<>
			<span class="pr-2">{ctx.formatId(props.musicId.robloxId)}</span>
			<CopyButton content={props.musicId.robloxId} />
		</>
	);
}

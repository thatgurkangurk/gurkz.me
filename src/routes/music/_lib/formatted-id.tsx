import type { MusicId } from "~/lib/schema/music";
import { useMusicIdFormat } from "./format";
import { createSignal, Show } from "solid-js";

function CopyButton(props: { content: string }) {
	const ctx = useMusicIdFormat();
	const [copying, setCopying] = createSignal(false);
	return (
		<button
			disabled={copying()}
			onClick={() => {
				setCopying(true);
				navigator.clipboard.writeText(ctx.formatId(props.content));
				setTimeout(() => {
					setCopying(false);
				}, 300);
			}}
		>
			<Show when={copying()} fallback={<>copy</>}>
				copied
			</Show>
		</button>
	);
}

export function FormattedId(props: { musicId: MusicId }) {
	const ctx = useMusicIdFormat();
	return (
		<p class="flex gap-1">
			<span>{props.musicId.name}</span> - <span>{ctx.formatId(props.musicId.robloxId)}</span>
			<CopyButton content={props.musicId.robloxId} />
		</p>
	);
}

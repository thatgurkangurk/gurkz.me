import { For } from "solid-js";
import type { MusicId } from "~/lib/music";
import { MusicCard } from "./music-card";

export function MusicList(props: { data: MusicId[] }) {
	return (
		<For each={props.data}>{(musicId) => <MusicCard musicId={musicId} />}</For>
	);
}

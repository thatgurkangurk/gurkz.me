import { For, Show } from "solid-js";
import { getMusicIds } from "~/lib/music";
import { MusicCard } from "./music-card";
import { createAsync } from "@solidjs/router";

export function MusicList() {
	const data = createAsync(() => getMusicIds());
	return (
		<Show when={data()}>
			<div class="pt-4 grid grid-cols-1 sm:grid-cols-2 w-full place-items-center md:grid-cols-3 xl:grid-cols-5 gap-4">
				<For each={data()}>{(musicId) => <MusicCard musicId={musicId} />}</For>
			</div>
		</Show>
	);
}

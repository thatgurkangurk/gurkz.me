import { MusicId } from "./music-id";
import { For, Show, Suspense } from "solid-js";
import { useMusicIds } from "~/lib/music";

export function MusicList() {
    const query = useMusicIds();

    return (
        <Suspense>
            <Show when={query.data}>
                {(musicIds) => (
                    <div class="pt-4 grid grid-cols-1 sm:grid-cols-2 w-full place-items-center md:grid-cols-3 xl:grid-cols-5 gap-4">
                        <For each={musicIds()}>
                            {(musicId) => <MusicId musicId={musicId} />}
                        </For>
                    </div>
                )}
            </Show>
        </Suspense>
    );
}

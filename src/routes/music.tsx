import { For, Show } from "solid-js";
import { CreateMusicIdForm } from "~/components/music/create-form";
import { FormatSelector } from "~/components/music/format-selector";
import { MusicCard } from "~/components/music/music-card";
import { Title } from "~/components/title";
import { getMusicIds } from "~/server/music";
import type { RouteDefinition} from "@solidjs/router";

export const route = {
    preload: () => void getMusicIds(),
} satisfies RouteDefinition;

export default function MusicPage() {
    const musicIds = getMusicIds();

    return (
        <>
            <Title>music ids</Title>
            <h1 class="text-3xl">music id list</h1>

            <CreateMusicIdForm />

            <FormatSelector />

            <Show when={musicIds.data}>
                {(data) => (
                    <div class="pt-4 grid grid-cols-1 sm:grid-cols-2 w-full place-items-center md:grid-cols-3 xl:grid-cols-5 gap-4">
                        <For
                            each={data()}
                            fallback={<p>no music ids have been created yet</p>}
                        >
                            {(musicId) => <MusicCard musicId={musicId} />}
                        </For>
                    </div>
                )}
            </Show>
        </>
    );
}

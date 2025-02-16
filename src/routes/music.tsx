import type { RouteDefinition } from "@solidjs/router";
import { For, Show } from "solid-js";
import { CreateMusicForm } from "~/components/music/create-form";
import { MusicCard } from "~/components/music/music-card";
import { MusicOptions } from "~/components/music/music-options";
import { Title } from "~/components/title";
import { verifiedOnly } from "~/lib/music/verified-only";
import { getMusicIds } from "~/server/music";

export const route = {
    preload: () => {
        // just to be safe
        void getMusicIds(() => true);
        void getMusicIds(() => false);
    },
} satisfies RouteDefinition;

export default function MusicPage() {
    const musicIds = getMusicIds(verifiedOnly);

    return (
        <>
            <Title>music ids</Title>
            <h1 class="text-3xl">music id list</h1>

            <CreateMusicForm />

            <MusicOptions />

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

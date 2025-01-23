import { RouteDefinition } from "@solidjs/router";
import { ErrorBoundary, For, Show, Suspense } from "solid-js";
import { CreateMusicIdForm } from "~/components/music/create-form";
import { FormatSelector } from "~/components/music/format-selector";
import { MusicCard } from "~/components/music/music-card";
import { Title } from "~/components/title";
import { Button } from "~/components/ui/button";
import { getMusicIds } from "~/server/music";

export const route = {
    preload: () => getMusicIds(),
} satisfies RouteDefinition;

export default function MusicPage() {
    const musicIds = getMusicIds(undefined, () => ({
        throwOnError: true,
    }));

    return (
        <>
            <Title>music ids</Title>
            <h1 class="text-3xl">music id list</h1>

            <CreateMusicIdForm />

            <FormatSelector />

            <Suspense fallback={<p>loading music ids...</p>}>
                <ErrorBoundary
                    fallback={(_, retry) => (
                        <>
                            <p>something went wrong</p>
                            <Button onClick={retry}>retry</Button>
                        </>
                    )}
                >
                    <Show when={musicIds.data}>
                        {(data) => (
                            <div class="pt-4 grid grid-cols-1 sm:grid-cols-2 w-full place-items-center md:grid-cols-3 xl:grid-cols-5 gap-4">
                                <For
                                    each={data()}
                                    fallback={
                                        <p>
                                            no music ids have been created yet
                                        </p>
                                    }
                                >
                                    {(musicId) => (
                                        <MusicCard musicId={musicId} />
                                    )}
                                </For>
                            </div>
                        )}
                    </Show>
                </ErrorBoundary>
            </Suspense>
        </>
    );
}

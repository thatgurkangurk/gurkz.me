import { RouteDefinition } from "@solidjs/router";
import { ErrorBoundary, For, Show, Suspense } from "solid-js";
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
                            <For
                                each={data()}
                                fallback={
                                    <p>no music ids have been created yet</p>
                                }
                            >
                                {(musicId) => (
                                    <p>
                                        {musicId.name} - {musicId.robloxId}
                                    </p>
                                )}
                            </For>
                        )}
                    </Show>
                </ErrorBoundary>
            </Suspense>
        </>
    );
}

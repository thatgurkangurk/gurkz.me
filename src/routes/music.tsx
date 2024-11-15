import { createAsync, RouteDefinition } from "@solidjs/router";
import { For } from "solid-js";
import { getMusicIds } from "~/lib/music";

export const route = {
    preload: () => getMusicIds()
} satisfies RouteDefinition;

export default function Music() {
    const musicIds = createAsync(() => getMusicIds());
    return (
        <>
           <h1 class="text-3xl">music id list</h1>
           <For each={musicIds()}>
              {(musicId) => <p>{musicId.name}: {musicId.robloxId}</p>}
           </For>
        </>
    )
}
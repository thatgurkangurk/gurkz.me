import { RouteDefinition } from "@solidjs/router";
import { For } from "solid-js";
import { getMusicIds } from "~/lib/music";

export const route = {
  preload: () => getMusicIds.raw({}),
} satisfies RouteDefinition;

export default function Music() {
  const musicIds = getMusicIds();
  return (
    <>
      <h1 class="text-3xl">music id list</h1>

      <For
        each={musicIds.data}
        fallback={<p>no music ids have been created</p>}
      >
        {(musicId) => (
          <p>
            {musicId.name}: {musicId.robloxId}
          </p>
        )}
      </For>
    </>
  );
}

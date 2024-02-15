import { trpc } from "~/lib/api";
import { For, Show } from "solid-js";
import { createAsync } from "@solidjs/router";

export default function PokemonVoteProject() {
  const pokemons = createAsync(() => trpc.pokemon.getPokemonPair.query());

  return (
    <>
      <h1>most beautiful pokémon</h1>
      <p>wip, but here are two randomly generated pokémon, just for you!</p>
      <Show when={pokemons()}>
        <div class="w-full flex flex-row justify-center gap-4">
          <For each={pokemons()!}>
            {(pokemon) => (
              <img
                class="bg-themeColor rounded-md"
                width={128}
                src={`/api/pokemon/image/${pokemon}.png`}
              />
            )}
          </For>
        </div>
      </Show>
    </>
  );
}

import { Match, Show, Switch, VoidComponent, onMount } from "solid-js";
import { trpc } from "~/lib/api";
import { Button } from "../ui/button";
import { TbLoader } from "solid-icons/tb";

const PokemonCards: VoidComponent = () => {
  const pokemon = trpc.pokemon.getPokemonPair.useQuery();

  onMount(() => {
    pokemon.refetch();
  });

  return (
    <>
      <Switch>
        <Match when={pokemon.isPending}>
          <p>Loading...</p>
        </Match>
        <Match when={pokemon.isError}>
          <p>Error: {pokemon.error!.message}</p>
        </Match>
        <Match when={pokemon.isSuccess}>
          {/* <div class="w-full flex flex-row justify-center gap-4">
            <PokemonCard id={pokemon.data![0]!} isLoading={false} />
            <PokemonCard id={pokemon.data![1]!} isLoading={false} />
          </div>

          <Button class="gap-2">these are boring, get me new ones</Button> */}

          <div class="w-full flex justify-center gap-4">
            <div class="flex-col">
              <div class="flex-row justify-center flex gap-14">
                <PokemonCard
                  id={pokemon.data![0]!}
                  isLoading={pokemon.isRefetching}
                />
                <PokemonCard
                  id={pokemon.data![1]!}
                  isLoading={pokemon.isRefetching}
                />
              </div>
              <div class="pt-2">
                <Button
                  disabled={pokemon.isRefetching}
                  onClick={() => {
                    pokemon.refetch();
                  }}
                  variant={"secondary"}
                  class="gap-2"
                >
                  <Show when={pokemon.isRefetching}>
                    <TbLoader class="mr-2 h-4 w-4 animate-spin" />
                  </Show>
                  these are boring, get me new ones
                </Button>
              </div>
            </div>
          </div>
        </Match>
      </Switch>
    </>
  );
};

const PokemonCard: VoidComponent<{ id: number; isLoading: boolean }> = (
  props
) => {
  return (
    <div class="w-32 h-32 bg-themeColor rounded-md flex justify-center items-center">
      <Switch>
        <Match when={props.isLoading}>
          <TbLoader size={64} class="animate-spin" />
        </Match>
        <Match when={!props.isLoading}>
          <img width={128} src={`/api/pokemon/image/${props.id}.png`} />
        </Match>
      </Switch>
    </div>
  );
};

export { PokemonCards };

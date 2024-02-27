import { Match, Show, Switch, VoidComponent } from "solid-js";
import { trpc } from "~/lib/api";
import { Button } from "../ui/button";
import { Spinner, SpinnerType } from "solid-spinner";

const PokemonCards: VoidComponent = () => {
  const pokemon = trpc.pokemon.getPokemonPair.useQuery();
  return (
    <>
      <Show when={pokemon.isLoading}>
        <p>loading</p>
      </Show>
      {/* <img
        class="bg-themeColor rounded-md"
        width={128}
        src={`/api/pokemon/image/${pokemon.data}.png`}
      /> */}

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
                  isLoading={!pokemon.isFetched}
                />
                <PokemonCard
                  id={pokemon.data![1]!}
                  isLoading={!pokemon.isFetched}
                />
              </div>
              <div class="pt-2">
                <Button
                  onClick={() => {
                    pokemon.refetch();
                  }}
                  variant={"secondary"}
                  class="gap-2"
                >
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
          <Spinner type={SpinnerType.puff} />
        </Match>
        <Match when={!props.isLoading}>
          <img width={128} src={`/api/pokemon/image/${props.id}.png`} />
        </Match>
      </Switch>
    </div>
  );
};

export { PokemonCards };

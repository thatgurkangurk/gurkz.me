import { Match, Suspense, Switch, lazy, onMount } from "solid-js";
import { trpc } from "~/lib/api";

const PokemonCards = lazy(() => import("~/components/pokemon/PokemonCards"));

export default function PokemonVoteProject() {
  const query = trpc.pokemon.getPokemonPair.useQuery();
  onMount(() => {
    query.refetch();
  });

  return (
    <>
      <h1>most beautiful pokémon</h1>
      <p>wip, but here are two randomly generated pokémon, just for you!</p>

      <Suspense fallback={<p>loading</p>}>
        <Switch>
          <Match when={query.isError}>
            <p>Error: {query.error!.message}</p>
          </Match>
          <Match when={query.isSuccess}>

            <PokemonCards data={query.data!} isRefetching={query.isRefetching} refetch={() => query.refetch()} />
          </Match>
        </Switch>
      </Suspense>
    </>
  );
}

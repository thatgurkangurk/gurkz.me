import { Match, Suspense, Switch, lazy, onMount } from "solid-js";
import { Leader } from "~/components/pokemon/Leader";
import { trpc } from "~/lib/api";

const PokemonCards = lazy(() => import("~/components/pokemon/PokemonCards"));

export default function PokemonVoteProject() {
	const pokemonPairQuery = trpc.pokemon.getPokemonPair.useQuery();
	const leaderQuery = trpc.pokemon.getLeader.useQuery();
	onMount(() => {
		pokemonPairQuery.refetch();
	});

	return (
		<>
			<h1>most beautiful pokémon</h1>

			<Suspense fallback={<p>loading</p>}>
				<Switch>
					<Match when={pokemonPairQuery.isError}>
						<p>Error: {pokemonPairQuery.error!.message}</p>
					</Match>
					<Match when={pokemonPairQuery.isSuccess}>
						<PokemonCards
							data={pokemonPairQuery.data!}
							isRefetching={pokemonPairQuery.isRefetching}
							refetch={() => {
								pokemonPairQuery.refetch();
								leaderQuery.refetch();
							}}
						/>
					</Match>
				</Switch>
			</Suspense>

			<Suspense fallback={<p>loading</p>}>
				<Switch>
					<Match when={leaderQuery.isError}>
						<p>Error: {leaderQuery.error!.message}</p>
					</Match>
					<Match when={leaderQuery.isSuccess}>
						<Leader data={leaderQuery.data!} />
					</Match>
				</Switch>
			</Suspense>
		</>
	);
}

import { BiRegularError } from "solid-icons/bi";
import { Match, Suspense, Switch, lazy, onMount } from "solid-js";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
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
			<Alert class="mb-2">
				<BiRegularError class="h-4 w-4" />
				<AlertTitle>warning</AlertTitle>
				<AlertDescription>
					this might look like it is working, but <b>no real votes are being cast.</b>
				</AlertDescription>
			</Alert>

			<Suspense fallback={<p>loading</p>}>
				<Switch>
					<Match when={query.isError}>
						<p>Error: {query.error!.message}</p>
					</Match>
					<Match when={query.isSuccess}>
						<PokemonCards
							data={query.data!}
							isRefetching={query.isRefetching}
							refetch={() => query.refetch()}
						/>
					</Match>
				</Switch>
			</Suspense>
		</>
	);
}

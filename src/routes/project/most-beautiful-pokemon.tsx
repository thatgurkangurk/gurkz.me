import { api } from "~/lib/api";
import { createAsync } from "@solidjs/router";

export default function PokemonVoteProject() {
    const pokemons = createAsync(() => api.pokemon.getPokemonPair.query());

    return (
        <>
           <h1>most beautiful pokémon</h1>
           <p>wip, but here are two randomly generated pokémon, just for you!</p>
           <img src={pokemons()[0]} />
           <img src={pokemons()[1]} />
        </>
    )
}
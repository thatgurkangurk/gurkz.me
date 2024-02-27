import { createTRPCRouter, publicProcedure } from "../utils";

// get random pokemon id (max id is 1010)
const getRandomPokemonID = (notThisOne?: number): number => {
  const id = Math.floor(Math.random() * 1009);
  if (id === notThisOne) return getRandomPokemonID(notThisOne);
  return id;
};

// limit the ID to be 1 through 1010
const limitPokemonID = (id: number) => Math.max(1, Math.min(1009, id));

export const pokemonRouter = createTRPCRouter({
  getPokemonPair: publicProcedure.query(async () => {
    const pokemonOne = limitPokemonID(getRandomPokemonID());
    const pokemonTwo = limitPokemonID(getRandomPokemonID(pokemonOne));

    return [pokemonOne, pokemonTwo];
  }),
  getPokemon: publicProcedure.query(() => {
    const pokemon = limitPokemonID(getRandomPokemonID());

    return pokemon;
  }),
});

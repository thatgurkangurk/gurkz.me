import { redis } from "~/lib/redis";
import { createTRPCRouter, publicProcedure } from "../utils";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

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
  vote: publicProcedure
    .input(
      z.object({
        for: z.number(),
        against: z.number(),
      })
    )
    .mutation(async (opts) => {
      const ip = opts.ctx.request.headers.get("x-forwarded-for") ?? "127.0.0.1";

      console.log(ip);

      let ttl = 0;

      const requests = await redis.incr(ip);
      if (requests === 1) {
        await redis.expire(ip, 60);
        ttl = 60;
      } else {
        ttl = await redis.ttl(ip);
      }

      if (requests > 10) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: `you have voted too many times too quickly. seconds left: ${ttl}. your vote was not cast.`,
        });
      }

      return {
        message: "vote submitted",
        requestsLeft: 10 - requests,
      };
    }),
});

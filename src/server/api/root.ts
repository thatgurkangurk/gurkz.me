import { pokemonRouter } from "./routers/pokemon";
import { createTRPCRouter } from "./utils";

export const appRouter = createTRPCRouter({
	pokemon: pokemonRouter,
});

export type AppRouter = typeof appRouter;

import { musicRouter } from "./routers/music";
import { t } from "./t";

export const appRouter = t.router({
	music: musicRouter
});

export type Router = typeof appRouter;

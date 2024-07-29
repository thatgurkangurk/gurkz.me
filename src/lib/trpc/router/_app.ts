import { router } from "../utils";
import music from "./music";

export const appRouter = router({
	music,
});

export type AppRouter = typeof appRouter;

import { createSolidAPIHandler } from "@solid-mediakit/trpc/handler";
import { createContext } from "~/lib/trpc/context";
import { appRouter } from "~/lib/trpc/router/_app";

const handler = createSolidAPIHandler({
	router: appRouter,
	createContext,
});

export const { GET, POST } = handler;

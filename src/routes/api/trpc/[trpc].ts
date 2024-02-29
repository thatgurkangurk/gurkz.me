import { createSolidAPIHandler } from "@solid-mediakit/trpc/handler";
import { createContext } from "~/server/api/context";
import { appRouter } from "~/server/api/root";

const handler = createSolidAPIHandler({
  router: appRouter,
  createContext,
});

export const { GET, POST } = handler;

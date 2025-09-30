import { os } from "@orpc/server";
import { dbMiddleware } from "./middleware/db";
import type { RequestHeadersPluginContext } from "@orpc/server/plugins";

type ORPCContext = RequestHeadersPluginContext;

export const or = os.$context<ORPCContext>().use(dbMiddleware);

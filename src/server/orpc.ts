import { os } from "@orpc/server";
import { dbMiddleware } from "@/server/middleware/db";
import type { RequestHeadersPluginContext } from "@orpc/server/plugins";

interface ORPCContext extends RequestHeadersPluginContext {}

export const or = os.$context<ORPCContext>().use(dbMiddleware);

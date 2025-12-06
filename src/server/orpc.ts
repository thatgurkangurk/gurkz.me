import { os } from "@orpc/server";
import { dbMiddleware } from "./middleware/db";
import { authMiddleware } from "./middleware/auth";
import { RequestHeadersPluginContext } from "@orpc/server/plugins";

type Context = {} & RequestHeadersPluginContext;

export const o = os.$context<Context>();

export const or = o.use(dbMiddleware).use(authMiddleware);

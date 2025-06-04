import { dbMiddleware } from "./orpc/middleware/db";
import { base } from "./orpc/base";

export const or = base.use(dbMiddleware);

export const pub = or;

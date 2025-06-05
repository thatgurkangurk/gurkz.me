import { dbMiddleware } from "./orpc/middleware/db";
import { base } from "./orpc/base";
import { authMiddleware } from "./orpc/middleware/auth";

export const or = base.use(dbMiddleware).use(authMiddleware);

export const pub = or;

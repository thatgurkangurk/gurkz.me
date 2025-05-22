import { os } from "@orpc/server";
import { authMiddleware, dbMiddleware } from "./orpc/middleware";

const or = os.use(dbMiddleware).use(authMiddleware);

export const pub = or;

export { or };

import { os } from "@orpc/server";
import { dbMiddleware } from "./middleware/db";

export const or = os.use(dbMiddleware);

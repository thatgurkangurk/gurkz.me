import { os } from "@orpc/server";
import { db } from "../../lib/db";

export const dbMiddleware = os
  .$context<{ db?: typeof db }>()
  .middleware(async ({ context, next }) => {
    const database = context.db ?? db;

    return next({
      context: {
        db: database,
      },
    });
  });

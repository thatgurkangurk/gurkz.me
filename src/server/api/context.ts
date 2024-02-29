import type { inferAsyncReturnType } from "@trpc/server";
import { createSolidAPIHandlerContext } from "solid-start-trpc";

export const createContextInner = async (
  opts: createSolidAPIHandlerContext
) => {
  return {
    request: opts.req,
    response: opts.res,
  };
};

export const createContext = async (opts: createSolidAPIHandlerContext) => {
  return await createContextInner(opts);
};

export type IContext = inferAsyncReturnType<typeof createContext>;

import type { inferAsyncReturnType } from "@trpc/server";
import type { createSolidAPIHandlerContext } from "@solid-mediakit/trpc/handler";

export const createContextInner = async (
	opts: createSolidAPIHandlerContext,
) => {
	return {
		...opts,
	};
};

export const createContext = async (opts: createSolidAPIHandlerContext) => {
	return await createContextInner(opts);
};

export type Context = inferAsyncReturnType<typeof createContext>;

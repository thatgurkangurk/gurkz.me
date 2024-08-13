import type { createSolidAPIHandlerContext } from "@solid-mediakit/trpc/handler";
import type { inferAsyncReturnType } from "@trpc/server";
import { getRequestEvent } from "solid-js/web";
import { db } from "../db";
import { musicIds } from "../schema/music";

export const createContextInner = async (
	opts: createSolidAPIHandlerContext,
) => {
	const requestEvent = getRequestEvent();

	const user = requestEvent?.locals.user;

	return {
		db,
		musicIds,
		user,
		...opts,
	};
};

export const createContext = async (opts: createSolidAPIHandlerContext) => {
	return await createContextInner(opts);
};

export type Context = inferAsyncReturnType<typeof createContext>;

import { os } from "@orpc/server";

export type Context = {
	headers: Headers;
};

/**
 * use `or` imported from "~/server/orpc.ts" instead
 */
export const base = os.$context<Context>();

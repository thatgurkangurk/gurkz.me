import { os } from "@orpc/server";

type Context = {
	headers: Headers;
};

/**
 * use `or` imported from "~/server/orpc.ts" instead
 */
export const base = os.$context<Context>();

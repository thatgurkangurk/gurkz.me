import { os } from "@orpc/server";
import type { Context } from "$lib/context";

const or = os.$context<Context>();

export const pub = or;

export { or };

import { os } from "@orpc/server";
import { Context } from "./orpc/context";

const or = os.$context<Context>();

export const pub = or;

export { or };

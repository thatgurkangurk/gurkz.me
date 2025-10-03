import * as v from "valibot";
import { Context } from "runed";
import type { CookieState } from "$lib/cookie-state.svelte.js";

export const idFormatSchema = v.optional(v.picklist(["DEFAULT", "TRAITOR_TOWN"]), "DEFAULT");

export type IdFormat = v.InferOutput<typeof idFormatSchema>;

export const IdFormatContext = new Context<CookieState<IdFormat>>("ID_FORMAT_CTX");

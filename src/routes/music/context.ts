import * as v from "valibot";
import { CookieState } from "$lib/cookie-state.svelte.js";
import { createContext } from "svelte";

export const idFormatSchema = v.optional(v.picklist(["DEFAULT", "TRAITOR_TOWN"]), "DEFAULT");

export type IdFormat = v.InferOutput<typeof idFormatSchema>;

export const [getIdFormat, setIdFormat] = createContext<CookieState<IdFormat>>();

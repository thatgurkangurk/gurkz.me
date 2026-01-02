import * as z from "zod/v4";
import { CookieState } from "$lib/cookie-state.svelte.js";
import { createContext } from "svelte";

export const idFormatSchema = z.optional(z.enum(["DEFAULT", "TRAITOR_TOWN"])).default("DEFAULT");

export type IdFormat = z.infer<typeof idFormatSchema>;

export const [getIdFormat, setIdFormat] = createContext<CookieState<IdFormat>>();

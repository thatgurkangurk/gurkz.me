import type { CookieState } from "$lib/cookie-state.svelte";
import { Context } from "runed";
import { z } from "zod/v4";

export const idFormatSchema = z.enum(["DEFAULT", "TRAITOR_TOWN"]).default("DEFAULT");

export type IdFormat = z.infer<typeof idFormatSchema>;

export const IdFormatContext = new Context<CookieState<IdFormat>>("ID_FORMAT_CTX");

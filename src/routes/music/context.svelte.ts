import * as z from "zod/v4";
import { CookieState } from "$lib/cookie-state.svelte.js";
import { createContext } from "svelte";

export const idFormatSchema = z.optional(z.enum(["DEFAULT", "TRAITOR_TOWN"])).default("DEFAULT");

export type IdFormat = z.infer<typeof idFormatSchema>;

export class IdFormatState {
	idFormat: CookieState<IdFormat>;

	constructor(initialIdFormat: IdFormat) {
		this.idFormat = new CookieState("id_format", initialIdFormat);
	}

	format(robloxId: string): string {
		switch (this.idFormat.current) {
			case "DEFAULT": {
				return robloxId;
			}
			case "TRAITOR_TOWN": {
				return `s/${robloxId}`;
			}
			default: {
				return robloxId;
			}
		}
	}
}

export const [getIdFormat, setIdFormat] = createContext<IdFormatState>();

import * as z from "zod/v4";
import { CookieState } from "#lib/cookie-state.svelte.js";
import { createContext } from "svelte";

export const idFormatSchema = z.optional(z.enum(["DEFAULT", "TRAITOR_TOWN"])).default("DEFAULT");

export const ID_FORMAT_LABELS: Record<IdFormat, string> = {
	DEFAULT: "default",
	TRAITOR_TOWN: "traitor town"
};

export const ID_FORMAT_OPTIONS = (Object.keys(ID_FORMAT_LABELS) as IdFormat[]).map((value) => ({
	value,
	label: ID_FORMAT_LABELS[value]
}));

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

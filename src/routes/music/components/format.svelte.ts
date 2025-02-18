import * as v from "valibot";

export const idFormatSchema = v.picklist(["DEFAULT", "TRAITOR_TOWN"]);

export type IdFormat = v.InferOutput<typeof idFormatSchema>;

export function formattedId(id: string | number, format: IdFormat): string {
	switch (format) {
		case "DEFAULT":
			return `${id}`;
		case "TRAITOR_TOWN":
			return `s/${id}`;
		default:
			return `${id}`;
	}
}

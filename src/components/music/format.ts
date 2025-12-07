import { atomWithCookie } from "~/lib/cookie-atom";
import { z } from "zod/v4";

const idFormatSchema = z.enum(["DEFAULT", "TRAITOR_TOWN"]).default("DEFAULT");

type IdFormat = z.infer<typeof idFormatSchema>;

const idFormat = atomWithCookie(
	"id_format",
	idFormatSchema.def.defaultValue,
	idFormatSchema,
);

function formatMusicId(musicId: string | number, format: IdFormat) {
	switch (format) {
		case "DEFAULT": {
			return musicId.toString();
		}
		case "TRAITOR_TOWN": {
			return `s/${musicId}`;
		}
	}
}

export { idFormatSchema, idFormat, type IdFormat, formatMusicId };

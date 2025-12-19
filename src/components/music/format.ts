import { z } from "zod/v4";
import { atomWithCookie } from "~/lib/cookie-atom";

const idFormatSchema = z.enum(["DEFAULT", "TRAITOR_TOWN"]).default("DEFAULT");

type IdFormat = z.infer<typeof idFormatSchema>;

const idFormat = atomWithCookie<IdFormat>(
  "id_format",
  idFormatSchema.def.defaultValue,
  idFormatSchema
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

export { formatMusicId, idFormat, idFormatSchema, type IdFormat };

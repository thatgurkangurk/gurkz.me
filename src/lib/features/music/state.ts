import * as z from "zod/v4";
import { atomWithCookie } from "#lib/util/cookie-atom.js";

const idFormatSchema = z
    .optional(z.enum(["DEFAULT", "TRAITOR_TOWN"]))
    .default("DEFAULT");

const ID_FORMAT_LABELS: Record<IdFormat, string> = {
    DEFAULT: "default",
    TRAITOR_TOWN: "traitor town",
};

const ID_FORMAT_OPTIONS = (Object.keys(ID_FORMAT_LABELS) as IdFormat[]).map(
    (value) => ({
        value,
        label: ID_FORMAT_LABELS[value],
    }),
);

type IdFormat = z.infer<typeof idFormatSchema>;

const idFormatAtom = atomWithCookie<IdFormat>("id_format", "DEFAULT");

export {
    type IdFormat,
    idFormatAtom,
    ID_FORMAT_LABELS,
    ID_FORMAT_OPTIONS,
    idFormatSchema,
};

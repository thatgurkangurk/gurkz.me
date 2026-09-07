import { type IdFormat, preferencesAtom } from "#lib/preferences.js";
import { atom } from "jotai";

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

const idFormatAtom = atom(
    (get) => get(preferencesAtom).musicIdFormat,
    (get, set, newFormat: "DEFAULT" | "TRAITOR_TOWN") => {
        const current = get(preferencesAtom);
        set(preferencesAtom, { ...current, musicIdFormat: newFormat });
    },
);

export { type IdFormat, idFormatAtom, ID_FORMAT_LABELS, ID_FORMAT_OPTIONS };

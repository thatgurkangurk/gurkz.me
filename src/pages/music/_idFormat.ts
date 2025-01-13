import type { IdFormat } from "./_types";
import { shared } from "@it-astro:request-nanostores";
import { useStore } from "@nanostores/solid";
import Cookies from "js-cookie";
import { atom, onSet } from "nanostores";
import type { Accessor } from "solid-js";

export const idFormatStore = shared("id_format", atom<IdFormat>("DEFAULT"));

onSet(idFormatStore, ({ newValue }) => {
    if (typeof window !== "undefined") {
        Cookies.set("id_format", newValue);
    }
});

function useIdFormat(): [Accessor<IdFormat>, (newValue: IdFormat) => void] {
    const idFormat = useStore(idFormatStore);
    const setIdFormat: (newValue: IdFormat) => void = (newValue: IdFormat) => {
        idFormatStore.set(newValue);
    };
    return [idFormat, setIdFormat];
}

function formatMusicId(id: string, format: IdFormat): string {
    switch (format) {
        case "DEFAULT": {
            return id;
        }
        case "TRAITOR_TOWN": {
            return `s/${id}`;
        }
        default: {
            return id;
        }
    }
}

export { formatMusicId, useIdFormat };

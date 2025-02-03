import { cookieStorage, makePersisted } from "@solid-primitives/storage";
import { createSignal } from "solid-js";

type IdFormat = "DEFAULT" | "TRAITOR_TOWN";

const [idFormat, setIdFormat] = makePersisted(
    // eslint-disable-next-line solid/reactivity
    createSignal<IdFormat>("DEFAULT"),
    {
        storage: cookieStorage.withOptions({
            expires: new Date(+new Date() + 3e10),
        }),
        name: "id_format",
    }
);

function formatId(id: string, format: IdFormat) {
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

export { idFormat, setIdFormat, formatId, type IdFormat };

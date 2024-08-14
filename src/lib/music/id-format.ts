import { cookieStorage, makePersisted } from "@solid-primitives/storage";
import { createSignal } from "solid-js";

type IdFormat = "NORMAL" | "TRAITOR_TOWN";

const [idFormat, setIdFormat] = createSignal<IdFormat>("NORMAL");

function getFormattedId(id: string | number, format: IdFormat): string {
	switch (format) {
		case "NORMAL":
			return `${id}`;
		case "TRAITOR_TOWN":
			return `s/${id}`;
		default:
			return `${id}`;
	}
}

export { type IdFormat, idFormat, setIdFormat, getFormattedId };

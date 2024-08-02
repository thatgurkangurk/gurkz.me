import { makePersisted, cookieStorage } from "@solid-primitives/storage";
import { createSignal } from "solid-js";

type IdFormat = "NORMAL" | "TRAITOR_TOWN";

const [idFormat, setIdFormat] = makePersisted(
	createSignal<IdFormat>("NORMAL"),
	{ name: "music_id_format", storage: cookieStorage },
);

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

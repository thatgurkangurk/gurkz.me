import { makePersisted, cookieStorage } from "@solid-primitives/storage";
import { createSignal } from "solid-js";

type IdFormat = "NORMAL" | "TRAITOR_TOWN";

const [idFormat, setIdFormat] = makePersisted(
	createSignal<IdFormat>("NORMAL"),
	{ name: "music_id_format", storage: cookieStorage },
);

export { type IdFormat, idFormat, setIdFormat };

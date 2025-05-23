import { makePersisted } from "@solid-primitives/storage";
import localforage from "localforage";
import { createSignal } from "solid-js";
import { isServer } from "solid-js/web";
import { createContextProvider } from "@solid-primitives/context";
import { z } from "zod/v4";

export const idFormat = z.enum(["DEFAULT", "TRAITOR_TOWN"]);

export type IdFormat = z.infer<typeof idFormat>;

export const [FormatProvider, useUnknownMusicIdFormat] = createContextProvider(
	(props: { initial: IdFormat }) => {
		const [format, setFormat] = makePersisted(createSignal<IdFormat>(props.initial), {
			storage: !isServer ? localforage : undefined,
			name: "id_format"
		});

		function formatId(id: string): string {
			switch (format()) {
				case "DEFAULT":
					return id;
				case "TRAITOR_TOWN":
					return `s/${id}`;
			}
		}

		return { format, setFormat, formatId };
	}
);

export function useMusicIdFormat() {
	const data = useUnknownMusicIdFormat();

	if (!data) throw new Error("useMusicIdFormat() has to be used within a <FormatProvider />!");

	return data;
}

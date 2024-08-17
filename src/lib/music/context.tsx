import { cookieStorage, makePersisted } from "@solid-primitives/storage";
import {
	type Accessor,
	createContext,
	createSignal,
	type Setter,
	type ParentProps,
	useContext,
} from "solid-js";
import type { IdFormat } from "./id-format";

const MusicContext = createContext<{
	idFormat: Accessor<IdFormat>;
	setIdFormat: Setter<IdFormat>;
}>();

export function useMusicContext() {
	const value = useContext(MusicContext);
	if (value === undefined) {
		throw new Error(
			"useMusicContext needs to be used within a <MusicProvider />",
		);
	}

	return value;
}

export function MusicProvider(props: ParentProps) {
	const [idFormat, setIdFormat] = makePersisted(
		createSignal<IdFormat>("NORMAL"),
		{
			storage: cookieStorage,
			name: "music_id_format",
		},
	);

	return (
		<MusicContext.Provider
			value={{
				idFormat: idFormat,
				setIdFormat: setIdFormat,
			}}
		>
			{props.children}
		</MusicContext.Provider>
	);
}

import { getLocalStorage, setLocalStorage } from "$lib/localstorage";
import { getContext, setContext } from "svelte";
import { z } from "zod";

export const idFormatSchema = z.enum(["NORMAL", "TRAITOR_TOWN"]);

export type IdFormat = z.infer<typeof idFormatSchema>;

const ID_FORMAT_KEY = Symbol("ID_FORMAT");

class MusicIdFormat {
	private _idFormat = $state<IdFormat>("NORMAL");

	constructor(idFormat: IdFormat = "NORMAL") {
		const existingIdFormat = getLocalStorage<IdFormat>("ID_FORMAT", idFormatSchema, idFormat);
		this._idFormat = existingIdFormat;
	}

	/**
	 * sets the id format to the provided string (also makes sure it is valid, if it isn't it defaults to NORMAL)
	 * @param format the format to set it to
	 */
	set(format: IdFormat) {
		setLocalStorage<IdFormat>("ID_FORMAT", idFormatSchema, format);
		this._idFormat = format;
	}

	formatId(id: number): string {
		switch (this._idFormat) {
			case "NORMAL":
				return `${id}`;
			case "TRAITOR_TOWN":
				return `s/${id}`;
		}
	}

	get idFormat() {
		return this._idFormat;
	}
}

export function setIdFormatState(idFormat: IdFormat = "NORMAL") {
	return setContext(ID_FORMAT_KEY, new MusicIdFormat(idFormat));
}

export function getIdFormatState() {
	return getContext<ReturnType<typeof setIdFormatState>>(ID_FORMAT_KEY);
}

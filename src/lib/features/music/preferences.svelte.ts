import { z } from "zod";

export const idFormatSchema = z.enum(["DEFAULT", "TRAITOR_TOWN"]).default("DEFAULT");
export type IdFormat = z.infer<typeof idFormatSchema>;

export const musicPreferencesSchema = z.object({
	idFormat: idFormatSchema.default("DEFAULT")
});
export type MusicPreferences = z.infer<typeof musicPreferencesSchema>;

export class MusicPreferencesStore {
	#state = $state<MusicPreferences>({ idFormat: "DEFAULT" });
	#onUpdate?: () => void;

	constructor(initial?: MusicPreferences, onUpdate?: () => void) {
		if (initial) this.#state = initial;
		this.#onUpdate = onUpdate;
	}

	get idFormat(): IdFormat {
		return this.#state.idFormat;
	}

	set idFormat(format: IdFormat) {
		this.update({ idFormat: format });
	}

	formatMusicId(robloxId: string): string {
		switch (this.idFormat) {
			case "DEFAULT": {
				return robloxId;
			}
			case "TRAITOR_TOWN": {
				return `s/${robloxId}`;
			}
			default: {
				return robloxId;
			}
		}
	}

	update(
		partial: Partial<MusicPreferences> | ((prev: MusicPreferences) => Partial<MusicPreferences>)
	) {
		const nextPartial = typeof partial === "function" ? partial(this.#state) : partial;
		this.#state = musicPreferencesSchema.parse({ ...this.#state, ...nextPartial });
		this.#onUpdate?.();
	}

	toJSON(): MusicPreferences {
		return $state.snapshot(this.#state);
	}
}

import { type IdFormat } from "#lib/preferences.svelte.js";

export { type IdFormat, ID_FORMAT_LABELS, ID_FORMAT_OPTIONS, formatMusicId };

const ID_FORMAT_LABELS: Record<IdFormat, string> = {
	DEFAULT: "default",
	TRAITOR_TOWN: "traitor town"
};

const ID_FORMAT_OPTIONS = (Object.keys(ID_FORMAT_LABELS) as IdFormat[]).map((value) => ({
	value,
	label: ID_FORMAT_LABELS[value]
}));

function formatMusicId(idFormat: IdFormat, robloxId: string): string {
	switch (idFormat) {
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

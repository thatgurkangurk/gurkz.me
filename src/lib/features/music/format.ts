import type { IdFormat } from "./preferences.svelte.js";

const ID_FORMAT_LABELS: Record<IdFormat, string> = {
	DEFAULT: "default",
	TRAITOR_TOWN: "traitor town"
};

const ID_FORMAT_OPTIONS = (Object.keys(ID_FORMAT_LABELS) as IdFormat[]).map((value) => ({
	value,
	label: ID_FORMAT_LABELS[value]
}));

export { ID_FORMAT_LABELS, ID_FORMAT_OPTIONS, type IdFormat };

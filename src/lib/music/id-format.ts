type IdFormat = "NORMAL" | "TRAITOR_TOWN";

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

export { type IdFormat, getFormattedId };

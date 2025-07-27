import { IdFormatContext } from "./context";

export function format(input: string | number) {
	const format = IdFormatContext.get().current;

	switch (format) {
		case "DEFAULT": {
			return input.toString();
		}
		case "TRAITOR_TOWN": {
			return `s/${input}`;
		}
		default: {
			return input.toString();
		}
	}
}

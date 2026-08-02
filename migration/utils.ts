export { local } from "../src/lib/server/db/index.js";
export { schema } from "../src/lib/server/db/schema.js";

export function toCamelCase(str: string): string {
	return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export function hydrateAndCamelCase(obj: JsonValue): unknown {
	if (obj === null || obj === undefined) {
		return obj;
	}

	if (typeof obj === "string") {
		const isoDateRegex = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:?\d{2})?$/;
		if (isoDateRegex.test(obj)) {
			const date = new Date(obj);
			if (!Number.isNaN(date.getTime())) {
				return date;
			}
		}
		return obj;
	}

	if (Array.isArray(obj)) {
		return obj.map((item: JsonValue) => hydrateAndCamelCase(item));
	}

	if (typeof obj === "object") {
		const hydrated: Record<string, unknown> = {};
		const record = obj as Record<string, JsonValue>;
		for (const key of Object.keys(record)) {
			const camelKey = toCamelCase(key);
			hydrated[camelKey] = hydrateAndCamelCase(record[key]);
		}
		return hydrated;
	}

	return obj;
}

import { drizzle } from "drizzle-orm/pg-proxy";
import { relations } from "./relations";
import { DATABASE_PROXY_URL, DATABASE_PROXY_NAME, DATABASE_PROXY_TOKEN } from "$app/env/private";

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

function hydrateDates(obj: JsonValue): unknown {
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
		return obj.map((item: JsonValue) => hydrateDates(item));
	}

	if (typeof obj === "object") {
		const hydrated: Record<string, unknown> = {};
		const record = obj as Record<string, JsonValue>;
		for (const key of Object.keys(record)) {
			hydrated[key] = hydrateDates(record[key]);
		}
		return hydrated;
	}

	return obj;
}

export const db = drizzle(
	async (
		sql: string,
		params: unknown[],
		method: "all" | "execute"
	): Promise<{ rows: Record<string, unknown>[] }> => {
		try {
			const response = await fetch(DATABASE_PROXY_URL, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${DATABASE_PROXY_TOKEN}`,
					"X-Database-Connection": DATABASE_PROXY_NAME
				},
				body: JSON.stringify({ sql, params, method })
			});

			if (!response.ok) {
				console.log(response.status);
				const errorData = (await response.json().catch(() => ({}))) as Record<string, unknown>;
				console.error("Error from pg proxy server:", errorData);
				return { rows: [] };
			}

			const rawData = (await response.json()) as JsonValue;
			const hydrated = hydrateDates(rawData);

			const rows = Array.isArray(hydrated) ? (hydrated as Record<string, unknown>[]) : [];

			return { rows };
		} catch (err: unknown) {
			const errorMessage = err instanceof Error ? err.message : String(err);
			console.error("Error connecting to pg proxy server:", errorMessage);
			return { rows: [] };
		}
	},
	{ relations: relations }
);

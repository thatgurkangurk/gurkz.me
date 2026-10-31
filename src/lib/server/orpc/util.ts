import { COMMON_ERROR_STATUS_MAP, ORPCError } from "@orpc/server";
import { error } from "@sveltejs/kit";

const ORPC_ERROR_MAP: Record<string, number> = {
	...COMMON_ERROR_STATUS_MAP
};

export async function handleOrpc<T>(fn: () => Promise<T>): Promise<T> {
	try {
		return await fn();
	} catch (err: unknown) {
		if (err instanceof ORPCError) {
			const statusCode = ORPC_ERROR_MAP[err.code] ?? 500;
			throw error(statusCode, err.message || "An unexpected error occurred");
		}

		throw err;
	}
}

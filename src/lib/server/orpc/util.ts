import { ORPCError } from "@orpc/server";
import { error } from "@sveltejs/kit";

const ORPC_ERROR_MAP: Record<string, number> = {
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	PAYMENT_REQUIRED: 402,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	METHOD_NOT_SUPPORTED: 405,
	NOT_ACCEPTABLE: 406,
	TIMEOUT: 408,
	CONFLICT: 409,
	GONE: 410,
	LENGTH_REQUIRED: 411,
	PRECONDITION_FAILED: 412,
	PAYLOAD_TOO_LARGE: 413,
	UNSUPPORTED_MEDIA_TYPE: 415,
	UNPROCESSABLE_CONTENT: 422,
	PRECONDITION_REQUIRED: 428,
	TOO_MANY_REQUESTS: 429,
	CLIENT_CLOSED_REQUEST: 499,
	INTERNAL_SERVER_ERROR: 500,
	NOT_IMPLEMENTED: 501,
	BAD_GATEWAY: 502,
	SERVICE_UNAVAILABLE: 503,
	GATEWAY_TIMEOUT: 504
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

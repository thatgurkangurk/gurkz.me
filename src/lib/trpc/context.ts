import type { RequestEvent } from "@sveltejs/kit";
import type { inferAsyncReturnType } from "@trpc/server";

export async function createContext(request: RequestEvent) {
	return {
		locals: request.locals
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;

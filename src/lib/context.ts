import type { RequestEvent } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import type { ResponseHeadersPluginContext } from "@orpc/server/plugins";
import { getSession } from "./server/auth";

type CreateContextOptions = {
	event: RequestEvent;
};

export async function createContext({ event }: CreateContextOptions) {
	const session = await getSession({ event: event });

	return {
		session: session,
		db: db
	};
}

export type Context = Awaited<ReturnType<typeof createContext>> & ResponseHeadersPluginContext;

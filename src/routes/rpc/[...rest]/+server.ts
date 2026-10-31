import { db } from "#lib/server/db/index.js";
import { router } from "#lib/server/orpc/router.js";

import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";

import type { RequestHandler } from "./$types";

const handler = new RPCHandler(router, {
	interceptors: [
		onError((error) => {
			console.error(error);
		})
	]
});

const handle: RequestHandler = async ({ request, locals }) => {
	const session = locals.session;
	const user = locals.user;
	const hasSession = Boolean(session && user);

	const { response } = await handler.handle(request, {
		prefix: "/rpc",
		context: {
			headers: request.headers,
			db: db,
			session: hasSession && session && user ? { session, user } : null
		}
	});

	return response ?? new Response("Not found", { status: 404 });
};

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;

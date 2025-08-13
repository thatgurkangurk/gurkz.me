import { RPCHandler } from "@orpc/server/fetch";
import type { RequestHandler } from "./$types";
import { router } from "$lib/server/router";
import { RequestHeadersPlugin } from "@orpc/server/plugins";

const handler = new RPCHandler(router, {
	plugins: [new RequestHeadersPlugin()]
});

const handle: RequestHandler = async ({ request }) => {
	const { response } = await handler.handle(request, {
		prefix: "/rpc",
		context: {}
	});

	return response ?? new Response("Not Found", { status: 404 });
};

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
export const HEAD = handle;
export const OPTIONS = handle;

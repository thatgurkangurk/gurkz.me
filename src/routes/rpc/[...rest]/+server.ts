import { RPCHandler } from "@orpc/server/fetch";
import { onError } from "@orpc/server";
import type { RequestHandler } from "@sveltejs/kit";
import { router } from "../../../router";
import { createContext } from "$lib/context";
import { ResponseHeadersPlugin } from "@orpc/server/plugins";

const handler = new RPCHandler(router, {
	interceptors: [
		onError((error) => {
			console.error(error);
		})
	],
	plugins: [new ResponseHeadersPlugin()]
});

const handle: RequestHandler = async (event) => {
	const context = await createContext({ event: event });
	const { response } = await handler.handle(event.request, {
		prefix: "/rpc",
		context: context
	});

	return response ?? new Response("Not Found", { status: 404 });
};

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;

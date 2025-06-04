import type { APIEvent } from "@solidjs/start/server";
import { RPCHandler } from "@orpc/server/fetch";
import { router } from "~/server/router";
import { getWebRequest } from "vinxi/http";

const handler = new RPCHandler(router);

async function handle({ request }: APIEvent) {
	const { response } = await handler.handle(request, {
		prefix: "/rpc",
		context: {
			headers: getWebRequest().headers
		}
	});

	return response ?? new Response("Not Found", { status: 404 });
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;

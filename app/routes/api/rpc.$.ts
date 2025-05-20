import { RPCHandler } from "@orpc/server/fetch";
import { createAPIFileRoute } from "@tanstack/solid-start/api";
import { router } from "../../router/index";

const handler = new RPCHandler(router);

async function handle({ request }: { request: Request }) {
	const { response } = await handler.handle(request, {
		prefix: "/api/rpc"
	});

	return response ?? new Response("Not Found", { status: 404 });
}

export const APIRoute = createAPIFileRoute("/api/rpc/$")({
	HEAD: handle,
	GET: handle,
	POST: handle,
	PUT: handle,
	PATCH: handle,
	DELETE: handle
});

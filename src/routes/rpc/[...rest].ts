import type { APIEvent } from "@solidjs/start/server";
import { RPCHandler } from "@orpc/server/fetch";
import { router } from "~/server/router";
import { db } from "../../../app/server/db";

const handler = new RPCHandler(router);

async function handle({ request }: APIEvent) {
	const { response } = await handler.handle(request, {
		prefix: "/rpc",
		context: {
			db: db
		}
	});

	return response ?? new Response("Not Found", { status: 404 });
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;

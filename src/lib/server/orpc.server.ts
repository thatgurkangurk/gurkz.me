import { createRouterClient } from "@orpc/server";
import { router } from "./router";
import { getRequestEvent } from "$app/server";
import { createRPCContext } from "./orpc";

globalThis.$client = createRouterClient(router, {
	context: async () => {
		const reqEvent = getRequestEvent();
		const ctx = await createRPCContext({ headers: reqEvent.request.headers });
		return ctx;
	}
});

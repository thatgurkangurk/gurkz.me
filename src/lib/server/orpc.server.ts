import { createRouterClient } from "@orpc/server";
import { router } from "./router";
import { getRequestEvent } from "$app/server";

globalThis.$client = createRouterClient(router, {
	context: () => {
		const reqEvent = getRequestEvent();
		return {
			reqHeaders: reqEvent.request.headers
		};
	}
});

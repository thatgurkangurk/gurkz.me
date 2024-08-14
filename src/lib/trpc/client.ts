import { createTRPCSolidStart } from "@solid-mediakit/trpc";
import { QueryClient } from "@tanstack/solid-query";
import { httpBatchLink } from "@trpc/client";
import { isServer } from "solid-js/web";
import type { AppRouter } from "./router/_app";

const getBaseUrl = () => {
	if (typeof window !== "undefined") return "";
	return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const trpc = createTRPCSolidStart<AppRouter>({
	config(event) {
		// PageEvent of Solid-start
		return {
			links: [
				httpBatchLink({
					url: `${getBaseUrl()}/api/trpc`,
					headers: () => {
						if (isServer && event?.request) {
							// do something
						}
						return {};
					},
				}),
			],
		};
	},
});

export const queryClient = new QueryClient();

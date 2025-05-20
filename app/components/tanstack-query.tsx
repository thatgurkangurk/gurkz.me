import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { ParentProps } from "solid-js";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			experimental_prefetchInRender: true
		}
	}
});

export function QueryProvider(props: ParentProps) {
	return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>;
}

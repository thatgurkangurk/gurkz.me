import { QueryClient } from "@tanstack/solid-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            experimental_prefetchInRender: true,
        },
    },
});

export { queryClient };

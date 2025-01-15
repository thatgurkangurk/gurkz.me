import { QueryClientProvider } from "@tanstack/solid-query";
import { SolidQueryDevtools } from "@tanstack/solid-query-devtools";
import { queryClient } from "~/lib/queryClient";

export function SolidQueryDevTools() {
    return (
        <QueryClientProvider client={queryClient}>
            <SolidQueryDevtools client={queryClient} />
        </QueryClientProvider>
    );
}

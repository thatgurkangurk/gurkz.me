"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getQueryClient } from "@/lib/get-query-client";
import type { ReactNode } from "react";
import { Provider } from "jotai";

export default function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <Provider>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools />
      </QueryClientProvider>
    </Provider>
  );
}

import { QueryClient, isServer } from "@tanstack/solid-query";
import { httpBatchLink } from "@trpc/client";
import { AppRouter } from "~/server/api/root";
import { createTRPCSolidStart } from "./mediakit/trpc";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return "";
  if (process.env.NODE_ENV === "production") return "https://www.gurkz.me";
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

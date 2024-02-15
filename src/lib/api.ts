import {
    createTRPCProxyClient,
    httpBatchLink,
    loggerLink,
  } from '@trpc/client';
  import { AppRouter } from "~/server/api/root";
  
  const getBaseUrl = () => {
    if (typeof window !== "undefined") return "";
    if (process.env.NODE_ENV === "production") return "https://www.gurkz.me";
    return `http://localhost:${process.env.PORT ?? 3000}`;
  };
  
  // create the client, export it
  export const api = createTRPCProxyClient<AppRouter>({
    links: [
        // will print out helpful logs when using client
        loggerLink(),
        // identifies what url will handle trpc requests
        httpBatchLink({ url: `${getBaseUrl()}/api/trpc` })
    ],
  });
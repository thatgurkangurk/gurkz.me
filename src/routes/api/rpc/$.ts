import { RPCHandler } from "@orpc/server/fetch";
import { createFileRoute } from "@tanstack/react-router";
import { onError } from "@orpc/server";
import { router } from "~/server/orpc/router";
import { RequestHeadersPlugin } from "@orpc/server/plugins";

const handler = new RPCHandler(router, {
  plugins: [new RequestHeadersPlugin()],
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

export const Route = createFileRoute("/api/rpc/$")({
  server: {
    handlers: {
      ANY: async ({ request }) => {
        const { response } = await handler.handle(request, {
          prefix: "/api/rpc",
          context: {},
        });

        return response ?? new Response("Not Found", { status: 404 });
      },
    },
  },
});

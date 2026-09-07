import { db } from "#lib/server/db/index.js";
import { router } from "#lib/server/router.js";
import { onError, ORPCError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { createFileRoute } from "@tanstack/react-router";

const handler = new RPCHandler(router, {
    interceptors: [
        onError((error) => {
            if (error instanceof ORPCError) {
                if (
                    error.code === "FORBIDDEN" ||
                    error.code === "UNAUTHORIZED"
                ) {
                    return;
                }
            }
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
                    context: {
                        headers: request.headers,
                        db: db,
                    },
                });

                return response ?? new Response("Not found", { status: 404 });
            },
        },
    },
});

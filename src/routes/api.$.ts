import { router } from "@/server/router";
import {
  createServerFileRoute,
  RequestHandler,
} from "@tanstack/react-start/server";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { RequestHeadersPlugin, CORSPlugin } from "@orpc/server/plugins";

const handler = new OpenAPIHandler(router, {
  plugins: [
    new CORSPlugin({
      origin: (origin, options) => origin,
      allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
    }),
    new RequestHeadersPlugin(),
    new OpenAPIReferencePlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
      specGenerateOptions: {
        info: {
          title: "gurkz.me api",
          version: "1.0.0",
        },
      },
    }),
  ],
});

const handle: RequestHandler = async ({ request }) => {
  const { response } = await handler.handle(request, {
    prefix: "/api",
  });

  return response ?? new Response("Not Found", { status: 404 });
};

export const ServerRoute = createServerFileRoute("/api/$").methods({
  HEAD: handle,
  GET: handle,
  POST: handle,
  PUT: handle,
  PATCH: handle,
  DELETE: handle,
});

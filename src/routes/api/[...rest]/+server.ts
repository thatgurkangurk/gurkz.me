import type { RequestHandler } from "./$types";
import { router } from "$lib/server/router";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { experimental_ValibotToJsonSchemaConverter } from "@orpc/valibot";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { RequestHeadersPlugin, CORSPlugin } from "@orpc/server/plugins";

const handler = new OpenAPIHandler(router, {
	plugins: [
		new CORSPlugin({
			origin: (origin) => origin,
			allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"]
		}),
		new RequestHeadersPlugin(),
		new OpenAPIReferencePlugin({
			schemaConverters: [new experimental_ValibotToJsonSchemaConverter()],
			specGenerateOptions: {
				info: {
					title: "gurkz.me api",
					version: "1.0.0"
				}
			}
		})
	]
});

const handle: RequestHandler = async ({ request }) => {
	const { response } = await handler.handle(request, {
		prefix: "/api"
	});

	return response ?? new Response("Not Found", { status: 404 });
};

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;

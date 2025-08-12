import type { RequestHandler } from "./$types";
import { router } from "$lib/server/router";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";

const handler = new OpenAPIHandler(router, {
	plugins: [
		new OpenAPIReferencePlugin({
			schemaConverters: [new ZodToJsonSchemaConverter()],
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

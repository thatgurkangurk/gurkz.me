import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { router } from "../../../router";
import type { RequestHandler } from "./$types";
import { ZodSmartCoercionPlugin, ZodToJsonSchemaConverter } from "@orpc/zod";
import { onError } from "@orpc/server";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";

const handler = new OpenAPIHandler(router, {
	interceptors: [
		onError((error) => {
			console.error(error);
		})
	],
	plugins: [
		new ZodSmartCoercionPlugin(),
		new OpenAPIReferencePlugin({
			schemaConverters: [new ZodToJsonSchemaConverter()],
			specGenerateOptions: {
				info: {
					title: "gurkan's website api",
					version: "1.0.0"
				},
				security: []
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

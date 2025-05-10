import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { router } from "../../../router";
import type { RequestHandler } from "./$types";
import { ZodSmartCoercionPlugin, ZodToJsonSchemaConverter } from "@orpc/zod";
import { onError } from "@orpc/server";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { CORSPlugin, ResponseHeadersPlugin } from "@orpc/server/plugins";
import { createContext } from "$lib/context";
import { experimental_ValibotToJsonSchemaConverter } from "@orpc/valibot";

const handler = new OpenAPIHandler(router, {
	interceptors: [
		onError((error) => {
			console.error(error);
		})
	],
	plugins: [
		new CORSPlugin({
			origin: (origin) => origin,
			allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"]
		}),
		new ZodSmartCoercionPlugin(),
		new OpenAPIReferencePlugin({
			schemaConverters: [
				new ZodToJsonSchemaConverter(),
				new experimental_ValibotToJsonSchemaConverter()
			],
			specGenerateOptions: {
				info: {
					title: "gurkan's website api",
					version: "1.0.0"
				},
				security: []
			}
		}),
		new ResponseHeadersPlugin()
	]
});

const handle: RequestHandler = async (event) => {
	const context = await createContext({
		event: event
	});
	const { response } = await handler.handle(event.request, {
		prefix: "/api",
		context: context
	});

	return response ?? new Response("Not Found", { status: 404 });
};

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;

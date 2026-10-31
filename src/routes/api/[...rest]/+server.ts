import { getSessionFromApiKey } from "#lib/server/api-helpers.js";
import { db } from "#lib/server/db/index.js";
import { router } from "#lib/server/orpc/router.js";

import { OpenAPIGenerator } from "@orpc/openapi";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferenceHandlerPlugin } from "@orpc/openapi/plugins";
import { onError } from "@orpc/server";
import { ZodToJsonSchemaConverter } from "@orpc/zod";

import type { RequestHandler } from "./$types";

const isDev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || process.env.VITE_PORT || "5173";
const devUrl = `http://localhost:${port}/api`;
const prodUrl = "https://www.gurkz.me/api";

const handler = new OpenAPIHandler(router, {
	interceptors: [
		onError((error) => {
			console.error(error);
		})
	],
	plugins: [
		new OpenAPIReferenceHandlerPlugin({
			spec: () =>
				generator.generate(router, {
					base: {
						info: {
							title: "gurkz.me api",
							version: "unversioned"
						},
						servers: isDev ? [{ url: devUrl }, { url: prodUrl }] : [{ url: prodUrl }],
						components: {
							securitySchemes: {
								apiKey: {
									type: "http",
									scheme: "bearer",
									description: "api key authentication"
								}
							}
						}
					}
				})
		})
	]
});

const generator = new OpenAPIGenerator({
	converters: [new ZodToJsonSchemaConverter()]
});

const handle: RequestHandler = async ({ request, locals }) => {
	const authContext =
		locals.session && locals.user
			? { session: locals.session, user: locals.user }
			: await (async () => {
					const authResult = await getSessionFromApiKey(request);
					return authResult.isOk()
						? { session: authResult.value.session, user: authResult.value.user }
						: null;
				})();

	const { response } = await handler.handle(request, {
		prefix: "/api",
		context: {
			headers: request.headers,
			db: db,
			session: authContext
		}
	});

	return response ?? new Response("Not found", { status: 404 });
};

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;

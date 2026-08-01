import type { DATABASE_URL } from "$app/env/private";
import { defineEnvVars } from "@sveltejs/kit/env";
import * as z from "zod/v4";

const isInCI = process.env.CI === "1";

function skipInCI<T extends z.ZodTypeAny>(schema: T): T {
	if (isInCI) {
		return schema.optional().catch("" as any) as unknown as T;
	}

	return schema;
}

export const variables = defineEnvVars({
	DATABASE_URL: {
		schema: skipInCI(z.url())
	},
	DATABASE_PROXY_URL: {
		schema: skipInCI(z.url())
	},
	DATABASE_PROXY_NAME: {
		schema: skipInCI(z.string())
	},
	DATABASE_PROXY_TOKEN: {
		schema: skipInCI(z.string())
	},
	BETTER_AUTH_SECRET: {
		schema: skipInCI(z.string())
	},
	DISCORD_CLIENT_ID: {
		schema: skipInCI(z.string())
	},
	DISCORD_CLIENT_SECRET: {
		schema: skipInCI(z.string())
	},
	BETTER_AUTH_URL: {
		schema: skipInCI(z.string())
	},
	GITHUB_CLIENT_ID: {
		schema: skipInCI(z.string())
	},
	GITHUB_CLIENT_SECRET: {
		schema: skipInCI(z.string())
	}
});

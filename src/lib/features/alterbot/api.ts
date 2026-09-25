import { ResultAsync, errAsync, okAsync } from "neverthrow";
import * as z from "zod/v4";

import {
	ListGuildChannelsResponseSchema,
	ListGuildsResponseSchema,
	type MessageRequest,
	MessageRequestSchema,
	type MessageResponse,
	SendMessageResponseSchema
} from "./schemas.js";

export type ApiError =
	| { type: "NETWORK_ERROR"; error: Error }
	| { type: "HTTP_ERROR"; status: number; statusText: string }
	| { type: "VALIDATION_ERROR"; error: z.ZodError };

export type RequestOptions = {
	token?: string;
	baseUrl?: string;
};

function request<T>(
	path: string,
	init: RequestInit = {},
	schema: z.ZodType<T>,
	options: RequestOptions = {}
): ResultAsync<T, ApiError> {
	const url = `${options.baseUrl ?? ""}${path}`;
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		...(init.headers as Record<string, string>)
	};

	if (options.token) {
		headers["Authorization"] = `Bearer ${options.token}`;
	}

	return ResultAsync.fromPromise(fetch(url, { ...init, headers }), (err) => ({
		type: "NETWORK_ERROR" as const,
		error: err as Error
	})).andThen((res) => {
		if (!res.ok) {
			return errAsync<T, ApiError>({
				type: "HTTP_ERROR",
				status: res.status,
				statusText: res.statusText
			});
		}

		return ResultAsync.fromPromise(res.json(), (err) => ({
			type: "NETWORK_ERROR" as const,
			error: err as Error
		})).andThen((data) => {
			const parsed = schema.safeParse(data);
			if (!parsed.success) {
				return errAsync<T, ApiError>({
					type: "VALIDATION_ERROR",
					error: parsed.error
				});
			}
			return okAsync(parsed.data);
		});
	});
}

export const listGuilds = (opts?: RequestOptions) =>
	request("/api/guilds", { method: "GET" }, ListGuildsResponseSchema, opts);

export const listGuildChannels = (guildId: string, opts?: RequestOptions) =>
	request(
		`/api/guilds/${encodeURIComponent(guildId)}/channels`,
		{ method: "GET" },
		ListGuildChannelsResponseSchema,
		opts
	);

export const sendMessage = (body: MessageRequest, opts?: RequestOptions) => {
	const parsed = MessageRequestSchema.safeParse(body);
	if (!parsed.success) {
		return errAsync<MessageResponse, ApiError>({
			type: "VALIDATION_ERROR",
			error: parsed.error
		});
	}

	return request(
		"/api/messages",
		{ method: "POST", body: JSON.stringify(parsed.data) },
		SendMessageResponseSchema,
		opts
	);
};

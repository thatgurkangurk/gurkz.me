import { mutationOptions, queryOptions } from "@tanstack/svelte-query";

import {
	type ApiError,
	type RequestOptions,
	listGuildChannels,
	listGuilds,
	sendMessage
} from "./api.js";
import type { ChannelResponse, GuildResponse, MessageRequest, MessageResponse } from "./schemas.js";

export const guildKeys = {
	all: ["guilds"] as const,
	root: (baseUrl?: string) => [...guildKeys.all, { baseUrl: baseUrl ?? "default" }] as const,
	lists: (baseUrl?: string) => [...guildKeys.root(baseUrl), "list"] as const,
	guild: (baseUrl: string | undefined, guildId: string) =>
		[...guildKeys.root(baseUrl), guildId] as const,
	channels: (baseUrl: string | undefined, guildId: string) =>
		[...guildKeys.guild(baseUrl, guildId), "channels"] as const,
	messages: (baseUrl: string | undefined, guildId: string) =>
		[...guildKeys.guild(baseUrl, guildId), "messages"] as const
};

export const guildsQueryOptions = (opts?: RequestOptions) =>
	queryOptions<GuildResponse[], ApiError>({
		queryKey: guildKeys.lists(opts?.baseUrl),
		queryFn: async () => {
			const res = await listGuilds(opts);
			if (res.isErr()) throw res.error;
			return res.value;
		}
	});

export const guildChannelsQueryOptions = (guildId: string, opts?: RequestOptions) =>
	queryOptions<ChannelResponse[], ApiError>({
		queryKey: guildKeys.channels(opts?.baseUrl, guildId),
		queryFn: async () => {
			const res = await listGuildChannels(guildId, opts);
			if (res.isErr()) throw res.error;
			return res.value;
		},
		enabled: !!guildId
	});

export const sendMessageMutationOptions = (guildId: string, opts?: RequestOptions) =>
	mutationOptions<MessageResponse, ApiError, MessageRequest>({
		mutationKey: [...guildKeys.guild(opts?.baseUrl, guildId), "send-message"],
		mutationFn: async (payload: MessageRequest) => {
			const res = await sendMessage(payload, opts);
			if (res.isErr()) throw res.error;
			return res.value;
		},
		onSuccess: (_data, _vars, _res, ctx) => {
			void ctx.client.invalidateQueries({
				queryKey: guildKeys.guild(opts?.baseUrl, guildId)
			});
		}
	});

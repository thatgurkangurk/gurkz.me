import * as z from "zod/v4";

export const ChannelResponseSchema = z.object({
	id: z.string(),
	kind: z.string(),
	name: z.string(),
	parent_id: z.string().nullable().optional(),
	position: z.number().int().min(0)
});

export const GuildResponseSchema = z.object({
	icon: z.string().nullable().optional(),
	id: z.string(),
	name: z.string()
});

export const MessageRequestSchema = z.object({
	channel_id: z.string(),
	message: z.string(),
	reply_to_id: z.string().nullable().optional()
});

export const MessageResponseSchema = z.object({
	message: z.string(),
	success: z.boolean()
});

export type ChannelResponse = z.infer<typeof ChannelResponseSchema>;
export type GuildResponse = z.infer<typeof GuildResponseSchema>;
export type MessageRequest = z.infer<typeof MessageRequestSchema>;
export type MessageResponse = z.infer<typeof MessageResponseSchema>;

export const ListGuildsResponseSchema = z.array(GuildResponseSchema);

export const ListGuildChannelsParamsSchema = z.object({
	guild_id: z.string()
});

export const ListGuildChannelsResponseSchema = z.array(ChannelResponseSchema);

export const SendMessageBodySchema = MessageRequestSchema;
export const SendMessageResponseSchema = MessageResponseSchema;

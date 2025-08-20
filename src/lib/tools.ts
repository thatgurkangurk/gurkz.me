export const TOOLS = [
	{
		slug: "webhook-destroyer",
		title: "webhook destroyer",
		description: "destroy discord webhooks with ease"
	},
	{
		slug: "cipher",
		title: "jester's cipher",
		description: "a simple cipher by kiwiman"
	}
] as const;

export type ToolSlug = (typeof TOOLS)[number]["slug"];
export type Tool = (typeof TOOLS)[number];

export const TOOLS_MAP: Record<ToolSlug, (typeof TOOLS)[number]> = Object.fromEntries(
	TOOLS.map((t) => [t.slug, t])
) as any;

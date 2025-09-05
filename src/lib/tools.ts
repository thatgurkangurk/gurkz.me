import { seo } from "./seo";

export const TOOLS = [
  {
    slug: "webhook-destroyer",
    title: "webhook destroyer",
    description: "destroy discord webhooks with ease",
  },
] as const;

export type ToolSlug = (typeof TOOLS)[number]["slug"];
export type Tool = (typeof TOOLS)[number];

export const TOOLS_MAP: Record<ToolSlug, (typeof TOOLS)[number]> =
  Object.fromEntries(TOOLS.map((t) => [t.slug, t])) as any;

export function toolSeo({
  tool,
  keywords,
  image,
}: {
  tool: ToolSlug;
  image?: string;
  keywords?: string;
}) {
  const toolFromSlug = TOOLS_MAP[tool];
  return seo({
    title: `${toolFromSlug.title} - tools - gurkan's website`,
    description: toolFromSlug.description,
    image: image,
    keywords: keywords,
  });
}

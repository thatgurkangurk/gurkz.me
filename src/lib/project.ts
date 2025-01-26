import { z } from "zod";

export const projectSchema = z.object({
    name: z.string(),
    description: z.string(),
    slug: z.string(),
});

export type Project = z.infer<typeof projectSchema>;

export const projects: readonly Project[] = [
    {
        name: "want you gone",
        description: "portal 2's ending remade in HTML, CSS and JS",
        slug: "want-you-gone",
    },
] as const;

export function getProjectBySlug(slug: string) {
    return projects.find((project) => project.slug === slug);
}

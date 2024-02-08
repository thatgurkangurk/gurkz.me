import { z } from "zod";

const projectSchema = z.object({
  title: z.string(),
  description: z.string(),
  slug: z.string().toLowerCase(),
});

type Project = z.infer<typeof projectSchema>;

const projects: Project[] = [
  {
    title: "bad apple in HTML",
    description: "bad apple remade in HTML",
    slug: "badapple",
  },
  {
    title: "webhook destroyer",
    description: "a simple tool to destroy discord webhooks",
    slug: "webhook-destroyer",
  },
];

export { type Project, projectSchema, projects };

import { z, defineCollection, reference } from "astro:content";

const blog = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string(),
		author: reference("authors"),
	}),
});

const authors = defineCollection({
	type: "data",
	schema: z.object({
		name: z.string(),
	}),
});

const projects = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string(),
		description: z.string(),
		needsJS: z.boolean(),
	}),
});

export const collections = {
	blog,
	authors,
	projects,
};

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

export const collections = {
	blog,
	authors,
};

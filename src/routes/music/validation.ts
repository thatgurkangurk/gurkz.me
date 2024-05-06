import { z } from "zod";
import { RegExpMatcher, englishDataset, englishRecommendedTransformers } from "obscenity";

const matcher = new RegExpMatcher({
	...englishDataset.build(),
	...englishRecommendedTransformers
});

export const formSchema = z.object({
	id: z.string().min(4).max(24),
	name: z
		.string()
		.min(4)
		.max(48)
		.refine(
			(input) => {
				if (matcher.hasMatch(input)) return false;
				return true;
			},
			{
				message: "name cannot include profanity"
			}
		)
});

export type FormSchema = typeof formSchema;

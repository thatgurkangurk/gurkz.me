import { z } from "zod";
import { RegExpMatcher, englishDataset, englishRecommendedTransformers } from "obscenity";

const matcher = new RegExpMatcher({
	...englishDataset.build(),
	...englishRecommendedTransformers
});

export const createMusicIdSchema = z.object({
	id: z
		.string()
		.min(4, {
			message: "id has to be longer than 4 characters"
		})
		.max(24, {
			message: "id has to be shorter than 24 characters"
		}),
	name: z
		.string()
		.min(4, {
			message: "name has to be longer than 4 characters"
		})
		.max(48, {
			message: "name has to be shorter than 48 characters"
		})
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

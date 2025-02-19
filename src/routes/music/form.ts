import * as v from "valibot";

export const createMusicIdSchema = v.object({
	id: v.pipe(
		v.string("please provide a string"),
		v.minLength(4, "id has to be longer than 4 characters"),
		v.maxLength(24, "id has to be shorter than 24 characters"),
		v.check((input) => !Number.isNaN(Number.parseInt(input)), "you have to provide a number")
	),
	name: v.pipe(
		v.string(),
		v.minLength(6, "the name has to be longer than 6 characters"),
		v.maxLength(128, "the name has to be shorter than 128 characters")
	),
	tags: v.pipe(
		v.array(
			v.pipe(
				v.string("you have to provide a tag value"),
				v.nonEmpty("you have to provide a tag value")
			)
		),
		v.maxLength(4, "you can only include a maximum of 4 tags")
	)
});

export type CreateMusicIdSchema = typeof createMusicIdSchema;

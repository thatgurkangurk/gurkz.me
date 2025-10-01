import * as v from "valibot";

export const CreateMusicIdSchema = v.object({
	name: v.pipe(
		v.string(),
		v.minLength(6, "the name has to be longer than 6 characters"),
		v.maxLength(128, "the name has to be shorter than 128 characters")
	),
	robloxId: v.pipe(
		v.string("please provide a string"),
		v.minLength(4, "id has to be longer than 4 characters"),
		v.maxLength(24, "id has to be shorter than 24 characters"),
		v.regex(/^\d+$/, "you can only provide numbers")
	),
	tags: v.pipe(
		v.array(
			v.pipe(
				v.string("you have to provide a tag value"),
				v.minLength(4, "the tag has to be longer than 4 characters"),
				v.maxLength(24, "the tag has to be shorter than 24 characters")
			)
		),
		v.maxLength(4, "you can only include a maximum of 4 tags")
	)
});

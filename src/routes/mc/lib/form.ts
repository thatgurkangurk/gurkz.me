import { z } from "zod";

const regex = new RegExp(
	/^((([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(:\d{1,5})?|((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9]))(:\d{1,5})?$/
);

const formSchema = z.object({
	ip: z.string().regex(regex, {
		message: "invalid address",
	}),
});

type FormSchema = typeof formSchema;

export { formSchema, type FormSchema };

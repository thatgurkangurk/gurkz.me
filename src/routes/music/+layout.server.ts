import { idFormatSchema, type IdFormat } from "./context.svelte.js";
import * as z from "zod/v4";
import { fromThrowable } from "neverthrow";

export function load({ cookies }) {
	const idFormatCookie = cookies.get("id_format") ?? `"DEFAULT"`;

	const parseJson = fromThrowable(
		() => JSON.parse(idFormatCookie) as unknown,
		() => "DEFAULT" as const
	);

	const parsedCookie = parseJson().match(
		(value) => value,
		() => {
			cookies.set("id_format", JSON.stringify("DEFAULT"), {
				maxAge: new Date(+new Date() + 3e10).getSeconds(), // 1 year
				path: "/",
				httpOnly: false,
				sameSite: "lax"
			});
			return "DEFAULT" as const;
		}
	);

	const parseResult = z.safeParse(idFormatSchema, parsedCookie);

	const idFormat: IdFormat = parseResult.success ? parseResult.data : "DEFAULT";

	return { idFormat };
}

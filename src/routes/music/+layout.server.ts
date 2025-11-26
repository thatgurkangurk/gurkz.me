import { idFormatSchema, type IdFormat } from "./context.js";
import * as v from "valibot";
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
				maxAge: new Date(+new Date() + 3e10), // 1 year
				path: "/",
				httpOnly: false,
				sameSite: "lax"
			});
			return "DEFAULT" as const;
		}
	);

	const parseResult = v.safeParse(idFormatSchema, parsedCookie);

	const idFormat: IdFormat = parseResult.success ? parseResult.output : "DEFAULT";

	return { idFormat };
}

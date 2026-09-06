import { fromThrowable } from "neverthrow";
import * as z from "zod/v4";

import { type IdFormat, idFormatSchema } from "./context.svelte.js";

export function load({ cookies }) {
	const idFormatCookie = cookies.get("id_format") ?? `"DEFAULT"`;

	const parseJson = fromThrowable(
		() => JSON.parse(idFormatCookie) as unknown,
		() => "DEFAULT" as const
	);

	const parsedCookie = parseJson().match(
		(value) => value,
		() => "DEFAULT" as const
	);

	const parseResult = z.safeParse(idFormatSchema, parsedCookie);
	const idFormat: IdFormat = parseResult.success ? parseResult.data : "DEFAULT";

	return { idFormat };
}

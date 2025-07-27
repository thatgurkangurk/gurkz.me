import { idFormatSchema, type IdFormat } from "./context.js";

export async function load({ cookies }) {
	const idFormatCookie = cookies.get("id_format") ?? `"DEFAULT"`;
	const parseResult = idFormatSchema.safeParse(JSON.parse(idFormatCookie));

	const idFormat: IdFormat = parseResult.success ? parseResult.data : "DEFAULT";

	return {
		idFormat
	};
}

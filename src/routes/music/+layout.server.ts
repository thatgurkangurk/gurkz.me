import { idFormatSchema, type IdFormat } from "./context.js";

export async function load({ cookies }) {
	const idFormatCookie = cookies.get("id_format") ?? `"DEFAULT"`;

	let parsedCookie;
	try {
		parsedCookie = JSON.parse(idFormatCookie);
	} catch {
		parsedCookie = "DEFAULT";
	}

	const parseResult = idFormatSchema.safeParse(parsedCookie);

	const idFormat: IdFormat = parseResult.success ? parseResult.data : "DEFAULT";

	return {
		idFormat
	};
}

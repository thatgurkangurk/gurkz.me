import { idFormatSchema, type IdFormat } from "./context.js";
import * as v from "valibot";

export async function load({ cookies }) {
	const idFormatCookie = cookies.get("id_format") ?? `"DEFAULT"`;

	const parsedCookie = await Promise.try<string, unknown[]>(() => JSON.parse(idFormatCookie)).catch(
		() => {
			cookies.set("id_format", JSON.stringify("DEFAULT"), {
				maxAge: new Date(+new Date() + 3e10), // 1 year
				path: "/",
				httpOnly: false,
				sameSite: "lax"
			});
			return "DEFAULT";
		}
	);

	const parseResult = await v.safeParseAsync(idFormatSchema, parsedCookie);

	const idFormat: IdFormat = parseResult.success ? parseResult.output : "DEFAULT";

	return {
		idFormat
	};
}

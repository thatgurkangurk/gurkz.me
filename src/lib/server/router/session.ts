import { Session, User } from "$lib/schemas/user";
import { auth } from "../auth";
import { or } from "../orpc";
import { z } from "zod/v4";

const getSessionSchema = z
	.object({
		session: Session,
		user: User
	})
	.nullable();

export const getSession = or
	.route({ method: "GET" })
	.output(getSessionSchema)
	.handler(async ({ context }) => {
		const { reqHeaders } = context;

		if (!reqHeaders) return null;

		const res = await auth.api.getSession({
			headers: reqHeaders
		});

		const data = await getSessionSchema.safeParseAsync(res);

		if (!data.success) return null;

		return data.data;
	});

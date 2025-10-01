import { Session, User } from "$lib/schemas/user";
import { ORPCError } from "@orpc/client";
import { auth } from "../auth";
import { or } from "../orpc";
import { z } from "zod/v4";
import * as v from "valibot";
import { SocialProvider } from "$lib/schemas/auth";

const getSessionSchema = v.nullable(
	v.object({
		session: Session,
		user: User
	})
);

export const getSession = or
	.route({ method: "GET" })
	.output(getSessionSchema)
	.handler(async ({ context }) => {
		const { reqHeaders } = context;

		if (!reqHeaders) {
			return null;
		}

		const res = await auth.api.getSession({
			headers: reqHeaders
		});

		const data = await v.safeParseAsync(getSessionSchema, res);

		if (!data.success) {
			console.error("Session validation failed:", data.issues);
			return null;
		}

		return data.output;
	});

export const signIn = or
	.route({ method: "POST" })
	.input(
		v.object({
			provider: SocialProvider
		})
	)
	.output(
		v.object({
			url: v.nullish(v.pipe(v.string(), v.url())),
			redirect: v.boolean()
		})
	)
	.handler(async ({ input }) => {
		switch (input.provider) {
			case "discord": {
				try {
					const res = await auth.api.signInSocial({
						body: {
							provider: input.provider,
							callbackURL: "/"
						}
					});

					return {
						url: res.url,
						redirect: res.redirect
					};
				} catch (err) {
					console.error(err);
					throw new ORPCError("INTERNAL_SERVER_ERROR", {
						defined: false
					});
				}
			}
		}
	});

export const signOut = or
	.route({ method: "POST" })
	.output(
		z.object({
			message: z.literal("ok")
		})
	)
	.handler(async ({ context }) => {
		const { headers } = context;

		if (!headers) throw new ORPCError("BAD_REQUEST");

		const res = await auth.api.signOut({
			headers: headers
		});

		if (!res.success) throw new ORPCError("BAD_REQUEST");

		return {
			message: "ok"
		};
	});

import { ORPCError } from "@orpc/server";
import { z } from "zod/v4";
import { auth } from "../auth";
import { Session, User } from "~/lib/schemas/user";
import { or } from "../orpc";
import { SocialProvider } from "~/lib/schemas/auth";

const getSessionSchema = z
  .object({
    session: Session,
    user: User,
  })
  .nullable();

const getSession = or
  .route({ method: "GET" })
  .output(getSessionSchema)
  .handler(async ({ context }) => {
    const { headers } = context;

    if (!headers) return null;

    const res = await auth.api.getSession({
      headers: headers,
    });

    const data = await getSessionSchema.safeParseAsync(res);

    if (!data.success) return null;

    return data.data;
  });

const signIn = or
  .route({ method: "POST" })
  .input(
    z.object({
      provider: SocialProvider,
    })
  )
  .output(
    z.object({
      url: z.url().nullish(),
      redirect: z.boolean(),
    })
  )
  .handler(async ({ input }) => {
    switch (input.provider) {
      case "discord": {
        try {
          const res = await auth.api.signInSocial({
            body: {
              provider: input.provider,
              callbackURL: "/",
            },
          });

          return {
            url: res.url,
            redirect: res.redirect,
          };
        } catch (err) {
          console.error(err);
          throw new ORPCError("INTERNAL_SERVER_ERROR", {
            defined: false,
          });
        }
      }
    }
  });

const signOut = or
  .route({ method: "POST" })
  .output(
    z.object({
      message: z.literal("ok"),
    })
  )
  .handler(async ({ context }) => {
    const { headers } = context;

    if (!headers) throw new ORPCError("BAD_REQUEST");

    const res = await auth.api.signOut({
      headers: headers,
    });

    if (!res.success) throw new ORPCError("BAD_REQUEST");

    return {
      message: "ok",
    };
  });

export const sessionRouter = {
  get: getSession,
  signIn: signIn,
  signOut: signOut,
};

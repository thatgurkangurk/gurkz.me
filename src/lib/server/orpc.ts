import { os, ORPCError } from "@orpc/server";
import { db } from "#lib/server/db/index.js";
import { auth, type Session, type User } from "./auth";
import { createPermix } from "permix/orpc";
import { type PermissionsDefinition, getRules } from "#lib/permix.js";

type Context = {
    db: typeof db;
    headers: Headers;
};

export const orpcPermix = createPermix<PermissionsDefinition>({
    onForbidden: () => {
        throw new ORPCError("FORBIDDEN", {
            message: "you do not have permission to do that",
        });
    },
});

export const base = os
    .$context<Context>()
    .use(async ({ context, next }) => {
        const session = await auth.api.getSession({
            headers: context.headers,
        });

        return next({
            context: { session: session as { session: Session; user: User } },
        });
    })
    .use(async ({ context, next }) => {
        return next({
            context: orpcPermix.setupContext(getRules(context.session?.user)),
        });
    });

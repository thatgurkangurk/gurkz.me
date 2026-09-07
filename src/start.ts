import {
    createServerOnlyFn,
    createCsrfMiddleware,
    createStart,
} from "@tanstack/react-start";
import { auth } from "#lib/server/auth.js";
import { permix, getRules } from "#lib/permix.js";

const getSession = createServerOnlyFn(async (request: Request) => {
    const session = await auth.api.getSession({
        headers: request.headers,
    });

    return session;
});

const csrfMiddleware = createCsrfMiddleware({
    filter: (ctx) => ctx.handlerType === "serverFn",
});

export const startInstance = createStart(() => ({
    requestMiddleware: [
        csrfMiddleware,
        permix.setupMiddleware(async ({ request }) => {
            const session = await getSession(request);

            // @ts-expect-error its fine
            const rules = getRules(session?.user);

            return rules;
        }),
    ],
}));

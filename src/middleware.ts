import { defineMiddleware } from "astro:middleware";
import { auth } from "~/lib/auth";

export const onRequest = defineMiddleware(async (context, next) => {
    const isAuthed = await auth.api.getSession({
        headers: context.request.headers,
    });

    if (isAuthed) {
        // @ts-expect-error this is fine, it's validated on the database
        context.locals.user = isAuthed.user;
        context.locals.session = isAuthed.session;
    } else {
        context.locals.user = null;
        context.locals.session = null;
    }

    return next();
});

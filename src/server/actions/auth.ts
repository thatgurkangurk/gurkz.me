import { createCaller, error$ } from "@solid-mediakit/prpc";
import { auth } from "~/lib/auth/actions";

const protectedCaller = createCaller.use(async () => {
    "use server";
    const user = await auth();

    if (!user)
        return error$("you need to be signed in to do this", {
            status: 403,
        });

    return {
        user: user,
    };
});

export { protectedCaller };

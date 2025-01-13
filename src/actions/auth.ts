import { defineAction } from "astro:actions";
import { z } from "zod";
import { auth as authClient } from "~/lib/auth";
import { socialProvidersSchema } from "~/lib/auth/providers";

const signOut = defineAction({
    accept: "form",
    handler: async (_, ctx) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _res = await authClient.api.signOut({
            headers: ctx.request.headers,
        });

        return {
            success: true,
        };
    },
});

const signInSocial = defineAction({
    accept: "form",
    input: z.object({
        provider: socialProvidersSchema,
    }),
    handler: async (input) => {
        const res = await authClient.api.signInSocial({
            body: {
                provider: input.provider,
            },
        });

        return {
            url: res.url,
        };
    },
});

export const auth = {
    signOut,
    signInSocial,
};

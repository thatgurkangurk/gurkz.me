import { action, json, redirect } from "@solidjs/router";
import { getWebRequest } from "vinxi/http";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { auth } from "~/server/auth";

const socialProviders = z.enum(["discord"]);

const socialLoginSchema = zfd.formData({
    provider: zfd.text(socialProviders),
});

const socialLoginAction = action(async (formData: FormData) => {
    "use server";
    const result = await socialLoginSchema.spa(formData);

    if (!result.success) {
        return json({
            error: {
                type: "validation",
                message: result.error.message,
            },
        });
    }

    const res = await auth.api.signInSocial({
        body: {
            provider: result.data.provider,
        },
    });

    return redirect(res.url!);
}, "social-login-action");

const signOutAction = action(async () => {
    "use server";
    await auth.api.signOut({
        headers: getWebRequest().headers,
    });

    return;
}, "sign-out-action");

export { socialLoginAction, signOutAction };

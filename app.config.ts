import { authVite } from "@solid-mediakit/auth-plugin";
import { withPRPC } from "@solid-mediakit/prpc-plugin";
import tailwindcss from "@tailwindcss/postcss";
import lucidePreprocess from "vite-plugin-lucide-preprocess";

const config = withPRPC(
    {
        ssr: true,
        server: {
            preset: "bun",
        },
        vite: {
            css: {
                postcss: {
                    plugins: [tailwindcss()],
                },
            },
            plugins: [
                authVite({
                    authOpts: {
                        // the variable name of your authOptions (exported!!)
                        name: "authOptions",
                        //   where your authOptions is located
                        dir: "~/server/auth.ts",
                    },
                    // where should we redirect when the user is not logged in
                    redirectTo: "/",
                }),
                lucidePreprocess({
                    importMode: "esm",
                }),
            ],
        },
    },
    {
        auth: "authjs",
        authCfg: {
            source: "~/server/auth",
            configName: "authOptions",
            protectedMessage: "you need to sign in first",
        },
    }
);

declare module "@solid-mediakit/prpc" {
    interface Settings {
        config: typeof config;
    }
}

export default config;

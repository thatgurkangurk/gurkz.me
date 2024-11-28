import { authVite } from "@solid-mediakit/auth-plugin";
import { withPRPC } from "@solid-mediakit/prpc-plugin";

const config = withPRPC(
    {
        ssr: true,
        server: {
            preset: "bun",
        },
        vite: {
            plugins: [
                authVite({
                    authOpts: {
                        // the variable name of your authOptions (exported!!)
                        name: "authOptions",
                        //   where your authOptions is located
                        dir: "~/lib/auth.ts",
                    },
                    // where should we redirect when the user is not logged in
                    redirectTo: "/",
                }),
            ],
        },
    },
    {
        auth: "authjs",
        authCfg: {
            source: "~/lib/auth",
            configName: "authOpts",
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

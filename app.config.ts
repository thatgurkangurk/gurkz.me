import { authVite } from "@solid-mediakit/auth-plugin";
import { withPRPC } from "@solid-mediakit/prpc-plugin";
import tailwindcss from "@tailwindcss/vite";
import lucidePreprocess from "vite-plugin-lucide-preprocess";

const config = withPRPC({
    ssr: true,
    vite: {
        plugins: [
            authVite({
                authOpts: {
                    name: "authOpts",
                    dir: "~/server/auth.ts",
                },
                redirectTo: "/",
            }),
            tailwindcss(),
            lucidePreprocess({
                importMode: "esm",
            }),
        ],
    },
});

declare module "@solid-mediakit/prpc" {
    interface Settings {
        config: typeof config;
    }
}

export default config;

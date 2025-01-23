import { withPRPC } from "@solid-mediakit/prpc-plugin";
import tailwindcss from "@tailwindcss/vite";
import lucidePreprocess from "vite-plugin-lucide-preprocess";

const config = withPRPC({
    ssr: true,
    vite: {
        plugins: [
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

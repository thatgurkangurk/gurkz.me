import { withPRPC } from "@solid-mediakit/prpc-plugin";
import tailwindcss from "@tailwindcss/postcss";
import lucidePreprocess from "vite-plugin-lucide-preprocess";

const config = withPRPC({
    ssr: true,
    vite: {
        css: {
            postcss: {
                plugins: [tailwindcss],
            },
        },
        plugins: [lucidePreprocess()],
    },
});

declare module "@solid-mediakit/prpc" {
    interface Settings {
        config: typeof config;
    }
}

export default config;

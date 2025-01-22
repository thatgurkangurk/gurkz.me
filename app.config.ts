import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/postcss";
import lucidePreprocess from "vite-plugin-lucide-preprocess";

export default defineConfig({
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

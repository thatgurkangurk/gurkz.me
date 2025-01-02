import type { Config } from "tailwindcss";

export default {
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
    theme: {
        extend: {
            colors: {
                themeColour: "#5EBFA8",
                themeBlack: "#121212",
                themeGrey: "#3d3d3d",
            },
        },
    },
    plugins: [],
    darkMode: "selector",
} satisfies Config;

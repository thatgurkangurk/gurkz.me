import type { Config } from "tailwindcss";

export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		extend: {
			fontFamily: {
				geist: "Geist Mono",
			},
			colors: {
				themeColor: "#5EBFA8",
				themeBlack: "#121212",
				themeGray: "#3d3d3d",
			},
		},
	},
	plugins: [],
} satisfies Config;

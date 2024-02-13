/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class", '[data-kb-theme="dark"]'],
  content: ["./src/**/*.{html,js,jsx,md,mdx,ts,tsx}"],
  presets: [require("./ui.preset.js")],
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
};

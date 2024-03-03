// @ts-check
/** @type {import("prettier").Config} */
export default {
    plugins: ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
    printWidth: 120,
    tabWidth: 4,
    trailingComma: "all",
    useTabs: true,
    overrides: [
        {
            files: ".astro",
            options: {
                parser: "astro"
            }
        }
    ]
}
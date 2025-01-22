import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import solid from "eslint-plugin-solid";
import globals from "globals";
import tseslint from "typescript-eslint";

/** @type {import("eslint").Linter.Config} */
export default [
    { ignores: [".vinxi/*", ".output/*"] },
    { files: ["**/*.{js,mjs,cjs,ts,tsx,jsx}"] },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    eslintConfigPrettier,
    {
        files: ["**/*.{ts,tsx}"],
        ...solid,
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: "tsconfig.json",
            },
        },
    },
];

// @ts-check
import js from "@eslint/js";
import globals from "globals";
import ts from "typescript-eslint";
import { fileURLToPath } from "node:url";
import prettier from "eslint-config-prettier";
import { includeIgnoreFile } from "@eslint/compat";

const gitignorePath = fileURLToPath(new URL("./.gitignore", import.meta.url));

export default ts.config(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	...ts.configs.recommended,
	prettier,
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	}
);

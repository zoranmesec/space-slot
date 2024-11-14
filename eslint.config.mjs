import globals from "globals";
import tseslint from "typescript-eslint";
import eslint from "@eslint/js";
/** @type {import('eslint').Linter.Config[]} */
export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["webpack/*"],
  },
  { languageOptions: { globals: globals.browser } },
];

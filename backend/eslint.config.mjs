import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: ["dist", "node_modules"],
  },
  {
    files: ["**/*.ts"],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
    },
    rules: {
      "no-console": "warn",
      "no-var": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": "error",
    },
  },
  {
    files: ["**/*.test.ts", "**/*.integration.test.ts"],
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
    },
  },
]);

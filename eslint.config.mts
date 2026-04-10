import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import security from "eslint-plugin-security";

export default defineConfig([
  { 
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], 
    plugins: { 
      js,
      security 
    },
    ignores: [
      "/*",
      ".github/workflows/*",
      "!/src",
      "dist/", 
      "build/",
      "node_modules/"
    ],
    rules: {
      ...js.configs.recommended.rules,
      ...security.configs.recommended.rules,
    },
    languageOptions: { globals: globals.browser } 
  },
  ...tseslint.configs.recommended,
]);

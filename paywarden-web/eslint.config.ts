import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // Base JS rules
  js.configs.recommended,

  // TypeScript rules
  tseslint.configs.recommended,

   {
    ignores: [
      "**/dist/**",
      "**/build/**",
      "**/.next/**",
      "**/coverage/**",
      "**/node_modules/**",

      // Common generated/vendor locations
      "**/vendor/**",
      "**/generated/**",
      "**/*.min.js",
      "**/*.bundle.js",
    ],
  },
  // React rules (flat)
  {
    ...react.configs.flat.recommended,
    settings: {
      react: {
        version: "detect",
        runtime: "automatic",
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/no-unescaped-entities": "off",
    },
  },

  // Application files
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // Allow common React/TS patterns
      "@typescript-eslint/no-unused-expressions": [
        "error",
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
        },
      ],

      // Ignore unused variables that start with _
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // Do NOT block builds on this
      "@typescript-eslint/no-explicit-any": "warn",

      // Reduce noise
      "no-empty": "warn",
      "no-func-assign": "error",
    },
  },

  // Test files
  {
    files: ["**/test/**", "**/*.test.*", "**/*.spec.*"],
    languageOptions: {
      globals: globals.jest,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
]);

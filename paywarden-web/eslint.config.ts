import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";

export default [
  // Base JS rules
  js.configs.recommended,

  // TypeScript rules (scoped)
  ...tseslint.configs.recommended,

  // Ignore generated files
  {
    ignores: [
      "**/dist/**",
      "**/build/**",
      "**/.next/**",
      "**/coverage/**",
      "**/node_modules/**",
      "**/vendor/**",
      "**/generated/**",
      "**/*.min.js",
      "**/*.bundle.js",
    ],
  },

  // React rules
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

  // Application rules
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      "@typescript-eslint/no-unused-expressions": [
        "error",
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
        },
      ],

      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      "@typescript-eslint/no-explicit-any": "warn",

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
];

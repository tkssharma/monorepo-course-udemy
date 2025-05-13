const tsPlugin = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const prettierPlugin = require("eslint-plugin-prettier");
const prettierConfig = require("eslint-config-prettier");

module.exports = [
  {
    files: ["**/*.ts", "**/*.js"], // Define files to lint
    ignores: [
      "node_modules",
      "coverage",
      ".vscode",
      "dist",
      "src/migrations/*.ts", // Add specific patterns to ignore
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 12, // Matches ES2021
        sourceType: "module",
      },
      globals: {
        window: "readonly", // Browser globals
        document: "readonly",
        console: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...prettierConfig.rules,
      "unused-imports/no-unused-imports-ts": "off",
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/no-var-requires": "off", // Allow CommonJS imports
      "no-useless-escape": "off",
      "no-case-declarations": "off",
      "no-empty": "off",
      "no-useless-catch": "off", // Handle regex exceptions
      "@typescript-eslint/no-empty-function": "off",
      "no-console": "off", // Allow console logs
      "@typescript-eslint/no-explicit-any": "off", // Allow `any` type
      "@typescript-eslint/no-non-null-assertion": "off", // Allow non-null assertions
      "no-async-promise-executor": "off",
    },
  },
];

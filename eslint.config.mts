import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js, prettier: require('eslint-plugin-prettier') },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
    ignores: ['**/node_modules/**', '**/dist/**', '**/build/**'],
    rules: {
      'prettier/prettier': ['error'],
    },
  },
  tseslint.configs.recommended,
]);

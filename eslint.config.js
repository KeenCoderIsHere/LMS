import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  // 1. Ignore folders (so ESLint doesn't waste time)
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**', 'Client/dist/**'],
  },

  // 2. Base settings for ALL JavaScript files (JS and JSX)
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
    },
  },

  // 3. BACKEND: Node.js environment (Server folder)
  {
    files: ['Server/**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: {
        ...globals.node, // Automatically includes process, __dirname, require, etc.
      },
    },
  },

  // 4. FRONTEND: Browser + React environment (Client folder)
  {
    files: ['Client/**/*.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser, // Automatically includes window, document, localStorage, etc.
      },
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
]);

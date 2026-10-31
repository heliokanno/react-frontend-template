import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vitest/config';

// https://vitest.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    css: false,
    exclude: ['**/node_modules/**', '**/dist/**'],
  },
});

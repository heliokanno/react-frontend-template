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
    // Playwright cuida do e2e; o Vitest ignora essa pasta.
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**'],
  },
});

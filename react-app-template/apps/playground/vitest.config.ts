import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vitest/config';

const playgroundSrc = fileURLToPath(new URL('./src', import.meta.url));
const coreSrc = fileURLToPath(new URL('../../packages/core/src', import.meta.url));

// https://vitest.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      { find: '@hmk/react-admin-kit/ui', replacement: `${coreSrc}/entries/ui.ts` },
      {
        find: '@hmk/react-admin-kit/design-system',
        replacement: `${coreSrc}/entries/design-system.ts`,
      },
      {
        find: '@hmk/react-admin-kit/authorization',
        replacement: `${coreSrc}/entries/authorization.ts`,
      },
      { find: '@hmk/react-admin-kit/auth', replacement: `${coreSrc}/entries/auth.ts` },
      { find: '@hmk/react-admin-kit/http', replacement: `${coreSrc}/entries/http.ts` },
      { find: '@hmk/react-admin-kit/query', replacement: `${coreSrc}/entries/query.ts` },
      { find: '@hmk/react-admin-kit', replacement: `${coreSrc}/entries/index.ts` },
      { find: /^@\/(shared|features|infrastructure)\//, replacement: `${coreSrc}/$1/` },
      { find: /^@\//, replacement: `${playgroundSrc}/` },
    ],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    css: false,
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**'],
  },
});

import { fileURLToPath, URL } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const playgroundSrc = fileURLToPath(new URL('./src', import.meta.url));
const coreSrc = fileURLToPath(new URL('../../packages/core/src', import.meta.url));

/**
 * Dev server do playground (spec 013).
 *
 * Durante o desenvolvimento, os subpaths `@hmk/react-admin-kit/*` resolvem para
 * o CÓDIGO-FONTE do pacote core (HMR sem build intermediário). Em produção, a
 * resolução segue os `exports` do pacote publicado — o playground continua
 * consumindo apenas a API pública (os mesmos subpaths).
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],
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
      // Alias interno do core (usado pelos barrels ao reexportarem shared/*):
      // resolve `@/shared|features|infrastructure` para o core/src.
      { find: /^@\/(shared|features|infrastructure)\//, replacement: `${coreSrc}/$1/` },
      // Alias local do playground (`@/app`, `@/config`, `@/demo`).
      { find: /^@\//, replacement: `${playgroundSrc}/` },
    ],
  },
});

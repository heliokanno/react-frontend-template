import { fileURLToPath, URL } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

/**
 * Build da biblioteca (spec 013).
 *
 * - Múltiplos entry points (um por subpath exportado no package.json).
 * - Formato ESM com `preserveModules` para tree-shaking fino no consumidor.
 * - React e as bibliotecas de ecossistema ficam externas (peers/deps), nunca
 *   embutidas no bundle, evitando cópias duplicadas no consumidor.
 * - Tipos `.d.ts` gerados pelo passo `tsc -p tsconfig.build.json`
 *   (vite-plugin-dts aqui cobre as declarações agregadas por entry).
 */

const srcDir = fileURLToPath(new URL('./src', import.meta.url));

/**
 * Externaliza TODA dependência de `node_modules` (bare specifier): peers e deps
 * são instaladas pelo consumidor, nunca embutidas no bundle. Apenas o código da
 * própria lib (imports relativos e via alias `@/`) entra no artefato.
 *
 * Observação: o plugin do React injeta `react/jsx-runtime`; ele também é bare e
 * portanto externalizado.
 */
function isExternal(id: string): boolean {
  // Imports relativos e absolutos pertencem à própria lib.
  if (id.startsWith('.') || id.startsWith('/')) return false;
  // Alias interno do core resolvido como fonte própria.
  if (id === '@' || id.startsWith('@/')) return false;
  // Qualquer outro specifier é uma dependência externa (incluindo @scope/pkg).
  return true;
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({
      entryRoot: 'src',
      include: ['src'],
      exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
      tsconfigPath: './tsconfig.build.json',
    }),
  ],
  resolve: {
    alias: {
      '@': srcDir,
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    lib: {
      entry: {
        index: fileURLToPath(new URL('./src/entries/index.ts', import.meta.url)),
        ui: fileURLToPath(new URL('./src/entries/ui.ts', import.meta.url)),
        'design-system': fileURLToPath(new URL('./src/entries/design-system.ts', import.meta.url)),
        authorization: fileURLToPath(new URL('./src/entries/authorization.ts', import.meta.url)),
        auth: fileURLToPath(new URL('./src/entries/auth.ts', import.meta.url)),
        http: fileURLToPath(new URL('./src/entries/http.ts', import.meta.url)),
        query: fileURLToPath(new URL('./src/entries/query.ts', import.meta.url)),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: isExternal,
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
});

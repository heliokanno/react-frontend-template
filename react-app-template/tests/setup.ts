import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';

import { server } from './msw/server';

// jsdom não implementa matchMedia; o ThemeProvider depende dele.
// Polyfill padrão (sem preferência escura) para os testes.
if (!window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });
}

// Fronteira de rede mockada por MSW durante os testes (ver testing.md).
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Desmonta a árvore React e reseta handlers após cada teste, evitando
// vazamento de estado entre testes.
afterEach(() => {
  cleanup();
  server.resetHandlers();
});

afterAll(() => server.close());

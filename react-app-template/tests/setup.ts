import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll } from 'vitest';

import { server } from './msw/server';

// Fronteira de rede mockada por MSW durante os testes (ver testing.md).
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Desmonta a árvore React e reseta handlers após cada teste, evitando
// vazamento de estado entre testes.
afterEach(() => {
  cleanup();
  server.resetHandlers();
});

afterAll(() => server.close());

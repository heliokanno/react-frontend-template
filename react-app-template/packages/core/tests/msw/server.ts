import { setupServer } from 'msw/node';

import { handlers } from './handlers';

/**
 * Servidor MSW para testes do núcleo (ambiente Node/jsdom).
 *
 * A fronteira de rede é mockada aqui, não a camada de aplicação (ver `testing.md`).
 */
export const server = setupServer(...handlers);

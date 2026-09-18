import { setupServer } from 'msw/node';

import { handlers } from './handlers';

/**
 * Servidor MSW para testes de integração/componente (ambiente Node/jsdom).
 *
 * A fronteira de rede é mockada aqui, não a camada de aplicação (ver `testing.md`).
 * Handlers concretos são adicionados pelas features; a base começa vazia.
 */
export const server = setupServer(...handlers);

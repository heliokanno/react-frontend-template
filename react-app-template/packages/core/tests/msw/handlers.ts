import type { RequestHandler } from 'msw';

/**
 * Handlers globais de rede para testes do núcleo.
 *
 * Começa vazio; cada teste registra seus próprios handlers de sucesso e erro
 * (incluindo o contrato `ProblemDetail`) via `server.use(...)`.
 */
export const handlers: RequestHandler[] = [];

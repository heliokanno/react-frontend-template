import type { RequestHandler } from 'msw';

/**
 * Handlers globais de rede para testes.
 *
 * Começa vazio nesta fundação. A camada de HTTP (spec 004) e as features
 * registram seus próprios handlers de sucesso e erro (incluindo `ProblemDetail`).
 */
export const handlers: RequestHandler[] = [];

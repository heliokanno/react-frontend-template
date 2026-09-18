import { QueryClient } from '@tanstack/react-query';

import type { AppError } from '@/infrastructure/errors/AppError';
import { toAppError } from '@/infrastructure/errors/toAppError';

/** Não repetir requisições para erros que não se resolvem com retry. */
function shouldRetry(failureCount: number, error: unknown): boolean {
  const appError = error as AppError;
  const nonRetryable: ReadonlyArray<AppError['kind']> = [
    'unauthorized',
    'forbidden',
    'notFound',
    'validation',
    'conflict',
  ];
  if (appError && nonRetryable.includes(appError.kind)) {
    return false;
  }
  return failureCount < 2;
}

/**
 * Cria o QueryClient com padrões consistentes de cache/retry para todo o
 * server state (ver `.kiro/steering/frontend-architecture.md` → Server State).
 * Erros são normalizados para `AppError` na fronteira.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        retry: shouldRetry,
        retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8_000),
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

/** Normaliza um erro desconhecido lançado por uma query/mutation em `AppError`. */
export { toAppError };

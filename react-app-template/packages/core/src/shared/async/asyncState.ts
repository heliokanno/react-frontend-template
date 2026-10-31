import type { AppError } from '@/infrastructure/errors/AppError';
import { toAppError } from '@/infrastructure/errors/toAppError';

/**
 * Estado assíncrono padronizado como discriminated union, para a UI tratar
 * todos os estados relevantes (ver `.kiro/steering/frontend-engineering.md`
 * → Production Quality First). Modela estados válidos de forma que estados
 * inválidos sejam irrepresentáveis.
 */
export type AsyncState<T> =
  | { readonly status: 'idle' }
  | { readonly status: 'loading' }
  | { readonly status: 'empty' }
  | { readonly status: 'success'; readonly data: T }
  | { readonly status: 'error'; readonly error: AppError };

type QueryLike<T> = {
  readonly isPending: boolean;
  readonly isError: boolean;
  readonly error: unknown;
  readonly data: T | undefined;
  readonly fetchStatus: 'fetching' | 'paused' | 'idle';
};

/** Considera "vazio" quando os dados são um array sem itens. */
function isEmpty<T>(data: T): boolean {
  return Array.isArray(data) && data.length === 0;
}

/**
 * Deriva um `AsyncState` a partir do resultado de um `useQuery`, aplicando a
 * regra de vazio. Os erros já devem chegar normalizados como `AppError`.
 */
export function toAsyncState<T>(query: QueryLike<T>): AsyncState<T> {
  if (query.isPending && query.fetchStatus === 'idle') {
    return { status: 'idle' };
  }
  if (query.isPending) {
    return { status: 'loading' };
  }
  if (query.isError) {
    // Normaliza o erro (nativo ou já AppError) na borda de leitura.
    return { status: 'error', error: toAppError(query.error) };
  }
  if (query.data === undefined || isEmpty(query.data)) {
    return { status: 'empty' };
  }
  return { status: 'success', data: query.data };
}

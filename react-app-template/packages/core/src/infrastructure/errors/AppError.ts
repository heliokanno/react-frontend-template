/**
 * Erro de aplicação estruturado (discriminated union por categoria).
 *
 * Traduz erros técnicos (rede, HTTP, parsing) em categorias estáveis que a
 * camada de apresentação sabe interpretar, sem vazar detalhes técnicos ao
 * usuário. Ver `.kiro/steering/frontend-architecture.md` → Error Handling.
 */

export type FieldErrors = Record<string, readonly string[]>;

export type AppErrorKind =
  | 'network'
  | 'timeout'
  | 'unauthorized'
  | 'forbidden'
  | 'notFound'
  | 'validation'
  | 'conflict'
  | 'server'
  | 'unknown';

export type AppError = {
  readonly kind: AppErrorKind;
  /** Código HTTP quando aplicável. */
  readonly status?: number;
  /** Mensagem técnica para observabilidade (não exibir ao usuário). */
  readonly detail?: string;
  /** Erros por campo, quando `kind === 'validation'`. */
  readonly fieldErrors?: FieldErrors;
};

export function createAppError(kind: AppErrorKind, params: Omit<AppError, 'kind'> = {}): AppError {
  return { kind, ...params };
}

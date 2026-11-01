/**
 * Contrato de erro padronizado (RFC 7807 / `ProblemDetail`), alinhado aos
 * backends da plataforma. Traduzido para `AppError` na borda (ver toAppError).
 */
export type ProblemDetail = {
  /** URI que identifica o tipo do problema. */
  readonly type?: string;
  /** Resumo legível do problema. */
  readonly title?: string;
  /** Código HTTP. */
  readonly status?: number;
  /** Detalhe específico desta ocorrência. */
  readonly detail?: string;
  /** URI da instância do problema. */
  readonly instance?: string;
  /** Erros de validação por campo (extensão comum ao RFC 7807). */
  readonly errors?: Record<string, readonly string[]>;
};

/** Type guard: verifica se um valor desconhecido tem forma de `ProblemDetail`. */
export function isProblemDetail(value: unknown): value is ProblemDetail {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    'title' in candidate || 'status' in candidate || 'detail' in candidate || 'errors' in candidate
  );
}

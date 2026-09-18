import { createAppError, type AppError, type AppErrorKind } from './AppError';
import { isProblemDetail, type ProblemDetail } from './ProblemDetail';

/** Erro lançado pelo HttpClient quando a resposta não é ok. */
export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly body: unknown,
  ) {
    super(`HTTP ${status}`);
    this.name = 'HttpError';
  }
}

/** Erro lançado pelo HttpClient quando a requisição excede o timeout. */
export class TimeoutError extends Error {
  constructor() {
    super('Request timed out');
    this.name = 'TimeoutError';
  }
}

function kindFromStatus(status: number): AppErrorKind {
  switch (status) {
    case 401:
      return 'unauthorized';
    case 403:
      return 'forbidden';
    case 404:
      return 'notFound';
    case 409:
      return 'conflict';
    case 422:
      return 'validation';
    default:
      if (status >= 500) return 'server';
      if (status === 400) return 'validation';
      return 'unknown';
  }
}

function fromHttpError(error: HttpError): AppError {
  const kind = kindFromStatus(error.status);
  const problem: ProblemDetail | undefined = isProblemDetail(error.body) ? error.body : undefined;

  const detail = problem?.detail ?? problem?.title;
  const fieldErrors = kind === 'validation' ? problem?.errors : undefined;

  return createAppError(kind, {
    status: error.status,
    ...(detail !== undefined ? { detail } : {}),
    ...(fieldErrors !== undefined ? { fieldErrors } : {}),
  });
}

function isAppError(value: unknown): value is AppError {
  return (
    typeof value === 'object' && value !== null && 'kind' in value && typeof value.kind === 'string'
  );
}

/**
 * Traduz qualquer erro capturado na borda de infraestrutura em um `AppError`.
 * Deve ser usado pelos adapters; o domínio nunca lida com detalhes técnicos.
 * Se o valor já for um `AppError`, é retornado como está (idempotente).
 */
export function toAppError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }
  if (error instanceof HttpError) {
    return fromHttpError(error);
  }
  if (error instanceof TimeoutError) {
    return createAppError('timeout', { detail: error.message });
  }
  if (error instanceof TypeError) {
    // fetch lança TypeError em falhas de rede.
    return createAppError('network', { detail: error.message });
  }
  return createAppError('unknown', {
    detail: error instanceof Error ? error.message : String(error),
  });
}

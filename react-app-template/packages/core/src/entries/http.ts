/**
 * Entry point público: camada HTTP e erros (`@hmk/react-admin-kit/http`).
 *
 * A configuração de runtime (base URL, timeout) é injetada pelo consumidor via
 * {@link createHttpConfig}; o núcleo não lê variáveis de ambiente do bundler.
 */
export type {
  HttpClient,
  HttpQuery,
  HttpRequestOptions,
  RequestInterceptor,
  ResponseInterceptor,
} from '@/infrastructure/http/HttpClient';
export { FetchHttpClient } from '@/infrastructure/http/FetchHttpClient';
export {
  createHttpConfig,
  DEFAULT_API_VERSION_PREFIX,
  DEFAULT_TIMEOUT_MS,
  type HttpConfig,
  type HttpConfigInput,
} from '@/infrastructure/http/httpConfig';

export {
  createAppError,
  type AppError,
  type AppErrorKind,
  type FieldErrors,
} from '@/infrastructure/errors/AppError';
export { toAppError, HttpError, TimeoutError } from '@/infrastructure/errors/toAppError';
export { getErrorMessage } from '@/infrastructure/errors/errorMessages';
export { isProblemDetail, type ProblemDetail } from '@/infrastructure/errors/ProblemDetail';

import type {
  HttpClient,
  HttpQuery,
  HttpRequestOptions,
  RequestInterceptor,
  ResponseInterceptor,
} from './HttpClient';
import type { HttpConfig } from './httpConfig';

import { HttpError, TimeoutError } from '@/infrastructure/errors/toAppError';

type FetchHttpClientDeps = {
  readonly config: HttpConfig;
  readonly requestInterceptors?: readonly RequestInterceptor[];
  readonly responseInterceptors?: readonly ResponseInterceptor[];
};

function buildQueryString(query: HttpQuery | undefined): string {
  if (!query) return '';
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) {
      params.append(key, String(value));
    }
  }
  const serialized = params.toString();
  return serialized ? `?${serialized}` : '';
}

/**
 * Corpos que o `fetch` já sabe serializar sozinho (ex.: upload de arquivo via
 * `FormData` — multipart; `Blob`; `URLSearchParams`; binários; streams; ou uma
 * `string` pronta). Para esses, o cliente NÃO serializa em JSON e NÃO define o
 * `Content-Type` — o browser define o cabeçalho correto (inclusive o boundary
 * do multipart). Qualquer outro valor é tratado como JSON.
 */
function isRawBody(body: unknown): body is BodyInit {
  return (
    typeof body === 'string' ||
    (typeof FormData !== 'undefined' && body instanceof FormData) ||
    (typeof Blob !== 'undefined' && body instanceof Blob) ||
    (typeof URLSearchParams !== 'undefined' && body instanceof URLSearchParams) ||
    (typeof ArrayBuffer !== 'undefined' && body instanceof ArrayBuffer) ||
    ArrayBuffer.isView(body) ||
    (typeof ReadableStream !== 'undefined' && body instanceof ReadableStream)
  );
}

/**
 * Implementação do HttpClient sobre `fetch` nativo. Centraliza base URL,
 * headers, timeout (via AbortController), parsing e interceptors. Só o adapter
 * conhece esses detalhes; a UI consome casos de uso.
 */
export class FetchHttpClient implements HttpClient {
  private readonly config: HttpConfig;
  private readonly requestInterceptors: readonly RequestInterceptor[];
  private readonly responseInterceptors: readonly ResponseInterceptor[];

  constructor({
    config,
    requestInterceptors = [],
    responseInterceptors = [],
  }: FetchHttpClientDeps) {
    this.config = config;
    this.requestInterceptors = requestInterceptors;
    this.responseInterceptors = responseInterceptors;
  }

  get<T>(path: string, options?: HttpRequestOptions): Promise<T> {
    return this.request<T>('GET', path, undefined, options);
  }

  post<T>(path: string, body?: unknown, options?: HttpRequestOptions): Promise<T> {
    return this.request<T>('POST', path, body, options);
  }

  put<T>(path: string, body?: unknown, options?: HttpRequestOptions): Promise<T> {
    return this.request<T>('PUT', path, body, options);
  }

  patch<T>(path: string, body?: unknown, options?: HttpRequestOptions): Promise<T> {
    return this.request<T>('PATCH', path, body, options);
  }

  delete<T>(path: string, options?: HttpRequestOptions): Promise<T> {
    return this.request<T>('DELETE', path, undefined, options);
  }

  private async request<T>(
    method: string,
    path: string,
    body: unknown,
    options?: HttpRequestOptions,
  ): Promise<T> {
    const url = `${this.config.baseUrl}${path}${buildQueryString(options?.query)}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeoutMs);

    if (options?.signal) {
      options.signal.addEventListener('abort', () => controller.abort(), { once: true });
    }

    const hasBody = body !== undefined;
    const raw = hasBody && isRawBody(body);
    // JSON só quando o corpo precisa ser serializado pelo cliente; para corpos
    // "raw" (FormData/Blob/etc.) o browser define o Content-Type apropriado.
    const jsonContentType = hasBody && !raw ? { 'Content-Type': 'application/json' } : {};
    const bodyInit: Pick<RequestInit, 'body'> = raw
      ? { body: body }
      : hasBody
        ? { body: JSON.stringify(body) }
        : {};

    let init: RequestInit = {
      method,
      headers: {
        Accept: 'application/json',
        ...jsonContentType,
        ...options?.headers,
      },
      signal: controller.signal,
      ...bodyInit,
    };

    for (const interceptor of this.requestInterceptors) {
      init = await interceptor(init);
    }

    try {
      let response = await fetch(url, init);
      for (const interceptor of this.responseInterceptors) {
        response = await interceptor(response);
      }
      return await this.parseResponse<T>(response);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new TimeoutError();
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    const isJson = response.headers.get('content-type')?.includes('application/json') ?? false;
    const payload: unknown = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      throw new HttpError(response.status, payload);
    }
    return payload as T;
  }
}

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

    let init: RequestInit = {
      method,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...options?.headers,
      },
      signal: controller.signal,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
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

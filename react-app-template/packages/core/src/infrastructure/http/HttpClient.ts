/**
 * Contrato do cliente HTTP central. A UI e os casos de uso nunca falam HTTP
 * diretamente; consomem portas que, por sua vez, usam este cliente na borda
 * (ver `.kiro/steering/hexagonal-architecture.md`).
 *
 * O cliente centraliza base URL, headers, timeout, parsing e interceptors.
 * Não contém regra de negócio.
 */

export type HttpQuery = Record<string, string | number | boolean | undefined>;

export type HttpRequestOptions = {
  /** Query string tipada; valores `undefined` são omitidos. */
  readonly query?: HttpQuery;
  /** Headers adicionais para esta requisição. */
  readonly headers?: Record<string, string>;
  /** Sinal externo de cancelamento (combinado ao timeout interno). */
  readonly signal?: AbortSignal;
};

export interface HttpClient {
  get<TResponse>(path: string, options?: HttpRequestOptions): Promise<TResponse>;
  post<TResponse>(path: string, body?: unknown, options?: HttpRequestOptions): Promise<TResponse>;
  put<TResponse>(path: string, body?: unknown, options?: HttpRequestOptions): Promise<TResponse>;
  patch<TResponse>(path: string, body?: unknown, options?: HttpRequestOptions): Promise<TResponse>;
  delete<TResponse>(path: string, options?: HttpRequestOptions): Promise<TResponse>;
}

/** Interceptor de request: ajusta init antes do envio (ex.: injeta token na 008). */
export type RequestInterceptor = (init: RequestInit) => RequestInit | Promise<RequestInit>;

/** Interceptor de response: observa/reage à resposta (ex.: refresh de token na 008). */
export type ResponseInterceptor = (response: Response) => Response | Promise<Response>;

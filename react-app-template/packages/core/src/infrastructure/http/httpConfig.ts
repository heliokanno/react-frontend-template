/**
 * Configuração do cliente HTTP. O que varia por projeto é configuração
 * (ver `.kiro/steering/product.md` → Configurabilidade), não hardcode.
 *
 * Na biblioteca (spec 013) a configuração é **injetada pelo consumidor**: o
 * núcleo não lê variáveis de ambiente do bundler (`import.meta.env`). O app
 * consumidor monta a config no composition root e a passa ao HttpClient.
 */
export type HttpConfig = {
  /** Base URL da API, incluindo o prefixo de versão. */
  readonly baseUrl: string;
  /** Timeout padrão das requisições, em ms. */
  readonly timeoutMs: number;
};

/** Prefixo de versão padrão da API, coerente com os backends da plataforma. */
export const DEFAULT_API_VERSION_PREFIX = '/api/v1';

/** Timeout padrão quando o consumidor não informa um valor. */
export const DEFAULT_TIMEOUT_MS = 15_000;

/** Entrada da factory de configuração, fornecida pelo consumidor da biblioteca. */
export type HttpConfigInput = {
  /** Origem da API (ex.: `https://api.exemplo.com`), sem o prefixo de versão. */
  readonly apiOrigin: string;
  /** Timeout das requisições, em ms. Default: {@link DEFAULT_TIMEOUT_MS}. */
  readonly timeoutMs?: number;
  /** Prefixo de versão da API. Default: {@link DEFAULT_API_VERSION_PREFIX}. */
  readonly apiVersionPrefix?: string;
};

/**
 * Monta a configuração do HttpClient a partir de valores fornecidos pelo
 * consumidor. Combina a origem com o prefixo de versão para formar a base URL.
 */
export function createHttpConfig(input: HttpConfigInput): HttpConfig {
  const origin = input.apiOrigin.replace(/\/+$/, '');
  const prefix = input.apiVersionPrefix ?? DEFAULT_API_VERSION_PREFIX;
  return {
    baseUrl: `${origin}${prefix}`,
    timeoutMs: input.timeoutMs ?? DEFAULT_TIMEOUT_MS,
  };
}

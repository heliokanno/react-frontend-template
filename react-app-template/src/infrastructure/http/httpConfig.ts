import { env } from '@/shared/config/env';

/**
 * Configuração do cliente HTTP. O que varia por projeto é configuração
 * (ver `.kiro/steering/product.md` → Configurabilidade), não hardcode.
 */
export type HttpConfig = {
  /** Base URL da API, incluindo o prefixo de versão. */
  readonly baseUrl: string;
  /** Timeout padrão das requisições, em ms. */
  readonly timeoutMs: number;
};

/** Prefixo de versão da API, coerente com os backends da plataforma. */
export const API_VERSION_PREFIX = '/api/v1';

const DEFAULT_TIMEOUT_MS = 15_000;

/** Monta a base URL combinando a origem (env) com o prefixo de versão. */
function buildBaseUrl(): string {
  const origin = env.apiBaseUrl?.replace(/\/+$/, '') ?? '';
  return `${origin}${API_VERSION_PREFIX}`;
}

export const httpConfig: HttpConfig = {
  baseUrl: buildBaseUrl(),
  timeoutMs: DEFAULT_TIMEOUT_MS,
};

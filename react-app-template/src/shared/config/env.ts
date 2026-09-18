/**
 * Acesso tipado e centralizado às variáveis de ambiente.
 *
 * Nesta fundação (spec 001) o conjunto é mínimo. A validação de variáveis
 * obrigatórias evolui na spec 004 (camada de HTTP), quando a base URL da API
 * passa a ser exigida. Aqui apenas expomos os valores de forma tipada, sem
 * espalhar `import.meta.env` pelo código.
 */

type AppEnv = {
  readonly apiBaseUrl: string | undefined;
  readonly mode: string;
  readonly isProduction: boolean;
  readonly isDevelopment: boolean;
};

export const env: AppEnv = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  mode: import.meta.env.MODE,
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV,
};

/**
 * Lê uma variável de ambiente obrigatória, falhando de forma explícita quando ausente.
 * Usar quando uma configuração for realmente necessária para a aplicação iniciar.
 */
export function requireEnv(value: string | undefined, name: string): string {
  if (value === undefined || value === '') {
    throw new Error(`Variável de ambiente obrigatória ausente: ${name}`);
  }
  return value;
}

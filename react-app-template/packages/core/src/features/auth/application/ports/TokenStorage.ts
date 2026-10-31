import type { SessionTokens } from '@/features/auth/domain/Session';

/**
 * Porta de saída para persistência dos tokens da sessão. Isola o mecanismo
 * concreto (a escolha e seus trade-offs de segurança ficam no adapter).
 */
export interface TokenStorage {
  read(): SessionTokens | null;
  write(tokens: SessionTokens): void;
  clear(): void;
}

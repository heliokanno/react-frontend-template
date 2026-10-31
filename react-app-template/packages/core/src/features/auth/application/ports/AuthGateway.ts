import type { Credentials, Session, SessionTokens } from '@/features/auth/domain/Session';

/**
 * Porta de saída: o que a aplicação precisa do mundo externo para autenticar.
 * Implementada por um adapter na infraestrutura (HTTP). Pertence ao núcleo.
 */
export interface AuthGateway {
  login(credentials: Credentials): Promise<Session>;
  /** Troca o refresh token por uma nova sessão. */
  refresh(tokens: SessionTokens): Promise<Session>;
  logout(tokens: SessionTokens): Promise<void>;
}

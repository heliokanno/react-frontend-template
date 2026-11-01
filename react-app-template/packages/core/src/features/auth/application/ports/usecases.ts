import type { Credentials, Session, SessionTokens } from '@/features/auth/domain/Session';

/**
 * Portas de entrada (casos de uso) — o que o mundo externo pode pedir à
 * aplicação. A UI consome estas interfaces, não implementações.
 */

export interface Login {
  execute(credentials: Credentials): Promise<Session>;
}

export interface Logout {
  execute(tokens: SessionTokens): Promise<void>;
}

export interface RefreshSession {
  execute(tokens: SessionTokens): Promise<Session>;
}

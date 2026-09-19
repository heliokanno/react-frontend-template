import type { AuthGateway } from '@/features/auth/application/ports/AuthGateway';
import type { Credentials, Session, SessionTokens } from '@/features/auth/domain/Session';
import { HttpError } from '@/infrastructure/errors/toAppError';

/**
 * Implementação fake em memória do `AuthGateway`, para testar casos de uso e
 * consumidores sem HTTP (ver `.kiro/steering/hexagonal-architecture.md`).
 */
export class InMemoryAuthGateway implements AuthGateway {
  private readonly session: Session;

  constructor(
    private readonly validCredentials: Credentials = {
      email: 'user@example.com',
      password: 'secret',
    },
  ) {
    this.session = {
      user: { id: '1', name: 'Usuário Teste', email: this.validCredentials.email },
      tokens: { accessToken: 'access-token', refreshToken: 'refresh-token' },
    };
  }

  login(credentials: Credentials): Promise<Session> {
    if (
      credentials.email === this.validCredentials.email &&
      credentials.password === this.validCredentials.password
    ) {
      return Promise.resolve(this.session);
    }
    return Promise.reject(new HttpError(401, { title: 'Invalid credentials' }));
  }

  refresh(tokens: SessionTokens): Promise<Session> {
    if (tokens.refreshToken === 'refresh-token') {
      return Promise.resolve(this.session);
    }
    return Promise.reject(new HttpError(401, { title: 'Invalid refresh token' }));
  }

  logout(): Promise<void> {
    return Promise.resolve();
  }
}

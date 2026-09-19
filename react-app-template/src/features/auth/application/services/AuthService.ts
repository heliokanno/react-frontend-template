import type { AuthGateway } from '../ports/AuthGateway';
import type { Login, Logout, RefreshSession } from '../ports/usecases';

import type { Credentials, Session, SessionTokens } from '@/features/auth/domain/Session';

/** Caso de uso: autenticar com credenciais. */
export class LoginService implements Login {
  constructor(private readonly gateway: AuthGateway) {}

  execute(credentials: Credentials): Promise<Session> {
    return this.gateway.login(credentials);
  }
}

/** Caso de uso: encerrar a sessão. */
export class LogoutService implements Logout {
  constructor(private readonly gateway: AuthGateway) {}

  execute(tokens: SessionTokens): Promise<void> {
    return this.gateway.logout(tokens);
  }
}

/** Caso de uso: renovar a sessão a partir dos tokens atuais. */
export class RefreshSessionService implements RefreshSession {
  constructor(private readonly gateway: AuthGateway) {}

  execute(tokens: SessionTokens): Promise<Session> {
    return this.gateway.refresh(tokens);
  }
}

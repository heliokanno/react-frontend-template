import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { AuthContext, type AuthContextValue, type AuthStatus } from './auth-context';

import type { TokenStorage } from '@/features/auth/application/ports/TokenStorage';
import type { Login, Logout, RefreshSession } from '@/features/auth/application/ports/usecases';
import type { CurrentUser, Session } from '@/features/auth/domain/Session';
import type { AccessTokenHolder } from '@/features/auth/infrastructure/authTokenInterceptor';

type AuthProviderDeps = {
  readonly login: Login;
  readonly logout: Logout;
  readonly refreshSession: RefreshSession;
  readonly tokenStorage: TokenStorage;
  /** Holder lido pelo interceptor de request para anexar o token. */
  readonly tokenHolder: AccessTokenHolder;
  readonly children: ReactNode;
};

/**
 * Provê a sessão à aplicação, isolando a autenticação da UI. Recupera a sessão
 * no bootstrap (refresh silencioso) e mantém o token do interceptor em sincronia.
 * Componentes consomem `useAuth`/`useCurrentUser`, nunca detalhes de token.
 */
export function AuthProvider({
  login,
  logout,
  refreshSession,
  tokenStorage,
  tokenHolder,
  children,
}: AuthProviderDeps) {
  // Estado inicial derivado da presença de tokens (initializer roda uma vez):
  // sem tokens, já nasce "unauthenticated" (evita setState síncrono no effect);
  // com tokens, "loading" até o refresh silencioso resolver.
  const [status, setStatus] = useState<AuthStatus>(() =>
    tokenStorage.read()?.refreshToken ? 'loading' : 'unauthenticated',
  );
  const [user, setUser] = useState<CurrentUser | null>(null);
  const bootstrapped = useRef(false);

  const applySession = useCallback(
    (session: Session) => {
      tokenStorage.write(session.tokens);
      tokenHolder.set(session.tokens.accessToken);
      setUser(session.user);
      setStatus('authenticated');
    },
    [tokenStorage, tokenHolder],
  );

  const clearSession = useCallback(() => {
    tokenStorage.clear();
    tokenHolder.set(null);
    setUser(null);
    setStatus('unauthenticated');
  }, [tokenStorage, tokenHolder]);

  // Recuperação de sessão no bootstrap: tenta refresh silencioso se houver tokens.
  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;

    const stored = tokenStorage.read();
    if (!stored?.refreshToken) {
      // Já iniciou como 'unauthenticated'; nada a recuperar.
      return;
    }

    refreshSession
      .execute(stored)
      .then(applySession)
      .catch(() => clearSession());
  }, [refreshSession, tokenStorage, applySession, clearSession]);

  const doLogin = useCallback(
    async (credentials: Parameters<Login['execute']>[0]) => {
      const session = await login.execute(credentials);
      applySession(session);
    },
    [login, applySession],
  );

  const doLogout = useCallback(async () => {
    const stored = tokenStorage.read();
    try {
      if (stored) await logout.execute(stored);
    } finally {
      clearSession();
    }
  }, [logout, tokenStorage, clearSession]);

  const value = useMemo<AuthContextValue>(
    () => ({ status, user, login: doLogin, logout: doLogout }),
    [status, user, doLogin, doLogout],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

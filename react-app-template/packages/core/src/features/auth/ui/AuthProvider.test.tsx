import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';

import { AuthProvider } from './AuthProvider';
import { useAuth } from './useAuth';

import type { TokenStorage } from '@/features/auth/application/ports/TokenStorage';
import {
  LoginService,
  LogoutService,
  RefreshSessionService,
} from '@/features/auth/application/services/AuthService';
import type { SessionTokens } from '@/features/auth/domain/Session';
import { createAccessTokenHolder } from '@/features/auth/infrastructure/authTokenInterceptor';
import { InMemoryAuthGateway } from '@/features/auth/infrastructure/InMemoryAuthGateway';

function createMemoryTokenStorage(initial: SessionTokens | null = null): TokenStorage {
  let tokens = initial;
  return {
    read: () => tokens,
    write: (next) => {
      tokens = next;
    },
    clear: () => {
      tokens = null;
    },
  };
}

function Harness() {
  const { status, user, login, logout } = useAuth();
  return (
    <div>
      <p>status: {status}</p>
      <p>user: {user?.email ?? 'nenhum'}</p>
      <button onClick={() => void login({ email: 'user@example.com', password: 'secret' })}>
        Entrar
      </button>
      <button onClick={() => void logout()}>Sair</button>
    </div>
  );
}

function renderProvider(storage: TokenStorage) {
  const gateway = new InMemoryAuthGateway();
  return render(
    <AuthProvider
      login={new LoginService(gateway)}
      logout={new LogoutService(gateway)}
      refreshSession={new RefreshSessionService(gateway)}
      tokenStorage={storage}
      tokenHolder={createAccessTokenHolder()}
    >
      <Harness />
    </AuthProvider>,
  );
}

afterEach(() => {
  localStorage.clear();
});

describe('AuthProvider', () => {
  it('inicia não autenticado quando não há tokens', async () => {
    renderProvider(createMemoryTokenStorage(null));
    expect(await screen.findByText('status: unauthenticated')).toBeInTheDocument();
  });

  it('autentica ao fazer login e expõe o usuário', async () => {
    renderProvider(createMemoryTokenStorage(null));
    await screen.findByText('status: unauthenticated');

    await userEvent.click(screen.getByRole('button', { name: /entrar/i }));

    expect(await screen.findByText('status: authenticated')).toBeInTheDocument();
    expect(screen.getByText('user: user@example.com')).toBeInTheDocument();
  });

  it('recupera a sessão no bootstrap via refresh silencioso', async () => {
    renderProvider(createMemoryTokenStorage({ accessToken: 'old', refreshToken: 'refresh-token' }));
    expect(await screen.findByText('status: authenticated')).toBeInTheDocument();
  });

  it('encerra a sessão ao fazer logout', async () => {
    renderProvider(createMemoryTokenStorage(null));
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }));
    await screen.findByText('status: authenticated');

    await userEvent.click(screen.getByRole('button', { name: /sair/i }));
    expect(await screen.findByText('status: unauthenticated')).toBeInTheDocument();
  });
});

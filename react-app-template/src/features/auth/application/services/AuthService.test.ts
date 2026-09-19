import { describe, expect, it } from 'vitest';

import { LoginService, LogoutService, RefreshSessionService } from './AuthService';

import { InMemoryAuthGateway } from '@/features/auth/infrastructure/InMemoryAuthGateway';
import { toAppError } from '@/infrastructure/errors/toAppError';

describe('AuthService (casos de uso com fake)', () => {
  it('autentica com credenciais válidas', async () => {
    const service = new LoginService(new InMemoryAuthGateway());

    const session = await service.execute({ email: 'user@example.com', password: 'secret' });

    expect(session.user.email).toBe('user@example.com');
    expect(session.tokens.accessToken).toBeTruthy();
  });

  it('rejeita credenciais inválidas', async () => {
    const service = new LoginService(new InMemoryAuthGateway());

    await expect(
      service.execute({ email: 'user@example.com', password: 'errada' }),
    ).rejects.toBeTruthy();

    // O erro propagado normaliza para "unauthorized".
    try {
      await service.execute({ email: 'user@example.com', password: 'errada' });
    } catch (error) {
      expect(toAppError(error).kind).toBe('unauthorized');
    }
  });

  it('renova a sessão com refresh token válido', async () => {
    const service = new RefreshSessionService(new InMemoryAuthGateway());

    const session = await service.execute({
      accessToken: 'old',
      refreshToken: 'refresh-token',
    });

    expect(session.user.email).toBe('user@example.com');
  });

  it('logout resolve sem erro', async () => {
    const service = new LogoutService(new InMemoryAuthGateway());
    await expect(
      service.execute({ accessToken: 'a', refreshToken: 'refresh-token' }),
    ).resolves.toBeUndefined();
  });
});

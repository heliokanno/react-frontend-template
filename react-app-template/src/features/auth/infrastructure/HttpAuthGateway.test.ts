import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { server } from '../../../../tests/msw/server';

import { HttpAuthGateway } from './HttpAuthGateway';

import { toAppError } from '@/infrastructure/errors/toAppError';
import { FetchHttpClient } from '@/infrastructure/http/FetchHttpClient';
import { httpConfig } from '@/infrastructure/http/httpConfig';

const baseUrl = httpConfig.baseUrl;

function makeGateway() {
  return new HttpAuthGateway(new FetchHttpClient({ config: httpConfig }));
}

describe('HttpAuthGateway', () => {
  it('mapeia a resposta de login para o domínio', async () => {
    server.use(
      http.post(`${baseUrl}/auth/login`, () =>
        HttpResponse.json({
          access_token: 'at',
          refresh_token: 'rt',
          user: { id: '1', name: 'Ana', email: 'ana@example.com' },
        }),
      ),
    );

    const session = await makeGateway().login({ email: 'ana@example.com', password: 'x' });

    expect(session).toEqual({
      user: { id: '1', name: 'Ana', email: 'ana@example.com', permissions: [] },
      tokens: { accessToken: 'at', refreshToken: 'rt' },
    });
  });

  it('mapeia as permissões do usuário quando presentes no DTO', async () => {
    server.use(
      http.post(`${baseUrl}/auth/login`, () =>
        HttpResponse.json({
          access_token: 'at',
          user: {
            id: '1',
            name: 'Ana',
            email: 'ana@example.com',
            permissions: ['dashboard:view', 'products:create'],
          },
        }),
      ),
    );

    const session = await makeGateway().login({ email: 'ana@example.com', password: 'x' });

    expect(session.user.permissions).toEqual(['dashboard:view', 'products:create']);
  });

  it('traduz credenciais inválidas (401) para unauthorized', async () => {
    server.use(
      http.post(`${baseUrl}/auth/login`, () =>
        HttpResponse.json({ title: 'Invalid credentials' }, { status: 401 }),
      ),
    );

    try {
      await makeGateway().login({ email: 'ana@example.com', password: 'errada' });
      expect.unreachable('deveria ter lançado');
    } catch (error) {
      expect(toAppError(error).kind).toBe('unauthorized');
    }
  });
});

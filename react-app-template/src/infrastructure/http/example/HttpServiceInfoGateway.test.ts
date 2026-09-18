import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { server } from '../../../../tests/msw/server';

import { HttpServiceInfoGateway } from './HttpServiceInfoGateway';

import { toAppError } from '@/infrastructure/errors/toAppError';
import { FetchHttpClient } from '@/infrastructure/http/FetchHttpClient';
import { httpConfig } from '@/infrastructure/http/httpConfig';

const baseUrl = httpConfig.baseUrl;

function makeGateway() {
  return new HttpServiceInfoGateway(new FetchHttpClient({ config: httpConfig }));
}

describe('HttpServiceInfoGateway', () => {
  it('mapeia o DTO da API para o modelo de domínio', async () => {
    server.use(
      http.get(`${baseUrl}/service-info`, () =>
        HttpResponse.json({ service_name: 'orders', version: '1.2.3', status: 'UP' }),
      ),
    );

    const info = await makeGateway().fetchInfo();

    expect(info).toEqual({ name: 'orders', version: '1.2.3', healthy: true });
  });

  it('traduz erro ProblemDetail (500) para AppError server', async () => {
    server.use(
      http.get(`${baseUrl}/service-info`, () =>
        HttpResponse.json(
          { title: 'Internal Server Error', status: 500, detail: 'boom' },
          { status: 500 },
        ),
      ),
    );

    try {
      await makeGateway().fetchInfo();
      expect.unreachable('deveria ter lançado');
    } catch (error) {
      const appError = toAppError(error);
      expect(appError.kind).toBe('server');
      expect(appError.status).toBe(500);
    }
  });

  it('traduz 422 com erros de campo para validação', async () => {
    server.use(
      http.get(`${baseUrl}/service-info`, () =>
        HttpResponse.json({ title: 'Invalid', errors: { name: ['obrigatório'] } }, { status: 422 }),
      ),
    );

    try {
      await makeGateway().fetchInfo();
      expect.unreachable('deveria ter lançado');
    } catch (error) {
      const appError = toAppError(error);
      expect(appError.kind).toBe('validation');
      expect(appError.fieldErrors).toEqual({ name: ['obrigatório'] });
    }
  });
});

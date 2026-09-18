import { describe, expect, it } from 'vitest';

import { HttpError, TimeoutError, toAppError } from './toAppError';

describe('toAppError', () => {
  it('mapeia 401 para unauthorized', () => {
    const result = toAppError(new HttpError(401, { title: 'Unauthorized' }));
    expect(result.kind).toBe('unauthorized');
    expect(result.status).toBe(401);
  });

  it('mapeia 403 para forbidden', () => {
    expect(toAppError(new HttpError(403, {})).kind).toBe('forbidden');
  });

  it('mapeia 404 para notFound', () => {
    expect(toAppError(new HttpError(404, {})).kind).toBe('notFound');
  });

  it('mapeia 500 para server', () => {
    expect(toAppError(new HttpError(500, {})).kind).toBe('server');
  });

  it('preserva erros de campo em validação (422)', () => {
    const problem = { title: 'Invalid', errors: { name: ['obrigatório'] } };
    const result = toAppError(new HttpError(422, problem));
    expect(result.kind).toBe('validation');
    expect(result.fieldErrors).toEqual({ name: ['obrigatório'] });
  });

  it('mapeia TimeoutError para timeout', () => {
    expect(toAppError(new TimeoutError()).kind).toBe('timeout');
  });

  it('mapeia TypeError (falha de rede) para network', () => {
    expect(toAppError(new TypeError('Failed to fetch')).kind).toBe('network');
  });

  it('usa unknown para erros não reconhecidos', () => {
    expect(toAppError(new Error('boom')).kind).toBe('unknown');
  });
});

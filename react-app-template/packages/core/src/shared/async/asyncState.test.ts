import { describe, expect, it } from 'vitest';

import { toAsyncState } from './asyncState';

import { createAppError } from '@/infrastructure/errors/AppError';

describe('toAsyncState', () => {
  it('idle quando pendente e ainda não buscou', () => {
    const state = toAsyncState({
      isPending: true,
      isError: false,
      error: null,
      data: undefined,
      fetchStatus: 'idle',
    });
    expect(state.status).toBe('idle');
  });

  it('loading quando está buscando', () => {
    const state = toAsyncState({
      isPending: true,
      isError: false,
      error: null,
      data: undefined,
      fetchStatus: 'fetching',
    });
    expect(state.status).toBe('loading');
  });

  it('error quando falha, expondo o AppError', () => {
    const appError = createAppError('server', { status: 500 });
    const state = toAsyncState({
      isPending: false,
      isError: true,
      error: appError,
      data: undefined,
      fetchStatus: 'idle',
    });
    expect(state).toEqual({ status: 'error', error: appError });
  });

  it('empty quando os dados são um array vazio', () => {
    const state = toAsyncState({
      isPending: false,
      isError: false,
      error: null,
      data: [],
      fetchStatus: 'idle',
    });
    expect(state.status).toBe('empty');
  });

  it('success com dados presentes', () => {
    const state = toAsyncState({
      isPending: false,
      isError: false,
      error: null,
      data: [{ id: '1' }],
      fetchStatus: 'idle',
    });
    expect(state).toEqual({ status: 'success', data: [{ id: '1' }] });
  });
});

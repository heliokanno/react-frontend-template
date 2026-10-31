import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { FetchHttpClient } from './FetchHttpClient';
import { createHttpConfig } from './httpConfig';

const config = createHttpConfig({ apiOrigin: 'https://api.test' });

function makeClient() {
  return new FetchHttpClient({ config });
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

describe('FetchHttpClient', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn().mockResolvedValue(jsonResponse({ ok: true }));
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('serializa corpo de objeto como JSON e define Content-Type application/json', async () => {
    await makeClient().post('/items', { name: 'Ana' });

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.body).toBe(JSON.stringify({ name: 'Ana' }));
    expect((init.headers as Record<string, string>)['Content-Type']).toBe('application/json');
  });

  it('passa FormData sem serializar e sem forçar Content-Type (multipart pelo browser)', async () => {
    const form = new FormData();
    form.append('file', new Blob(['x'], { type: 'text/plain' }), 'mov.xlsx');

    await makeClient().post('/imports/b3', form, { query: { recalculate: true } });

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://api.test/api/v1/imports/b3?recalculate=true');
    // O corpo é o próprio FormData, não uma string JSON.
    expect(init.body).toBe(form);
    // Sem Content-Type definido pelo cliente: o browser define com o boundary.
    expect((init.headers as Record<string, string>)['Content-Type']).toBeUndefined();
  });

  it('não envia corpo nem Content-Type em GET', async () => {
    await makeClient().get('/items');

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.body).toBeUndefined();
    expect((init.headers as Record<string, string>)['Content-Type']).toBeUndefined();
  });
});

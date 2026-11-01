import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';

import { routes } from './router';

import { AppProviders } from '@/app/providers/AppProviders';

function renderAt(initialPath: string) {
  const router = createMemoryRouter(routes, { initialEntries: [initialPath] });
  return render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  );
}

describe('router', () => {
  it('exibe a página inicial pública', async () => {
    renderAt('/');
    expect(
      await screen.findByRole('heading', { level: 1, name: /design system — tokens/i }),
    ).toBeInTheDocument();
  });

  it('redireciona rota protegida para o login quando não autenticado', async () => {
    renderAt('/dashboard');
    // O guard (sessão stub = unauthenticated) redireciona ao login.
    expect(await screen.findByRole('heading', { level: 1, name: /entrar/i })).toBeInTheDocument();
  });

  it('exibe a página 404 para rota inexistente', async () => {
    renderAt('/rota-que-nao-existe');
    expect(
      await screen.findByRole('heading', { level: 1, name: /página não encontrada/i }),
    ).toBeInTheDocument();
  });
});

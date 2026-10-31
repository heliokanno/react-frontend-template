import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';

import { DataGridExamplePage } from './DataGridExamplePage';

function renderPage(initialPath = '/examples/data-grid') {
  const router = createMemoryRouter(
    [{ path: '/examples/data-grid', element: <DataGridExamplePage /> }],
    { initialEntries: [initialPath] },
  );
  return render(<RouterProvider router={router} />);
}

describe('DataGridExamplePage', () => {
  it('lista a primeira página de usuários', () => {
    renderPage();
    const table = screen.getByRole('table');
    expect(within(table).getByText('Usuário 1')).toBeInTheDocument();
    expect(screen.getByText(/exibindo 1–10 de 42/i)).toBeInTheDocument();
  });

  it('filtra pela busca', async () => {
    renderPage();
    await userEvent.type(screen.getByRole('searchbox'), 'Usuário 42');

    const table = screen.getByRole('table');
    expect(within(table).getByText('Usuário 42')).toBeInTheDocument();
    expect(within(table).queryByText('Usuário 1')).not.toBeInTheDocument();
  });

  it('restaura o estado a partir da URL (página 2)', () => {
    renderPage('/examples/data-grid?page=2');
    expect(screen.getByText(/exibindo 11–20 de 42/i)).toBeInTheDocument();
  });

  it('navega para a próxima página', async () => {
    renderPage();
    await userEvent.click(screen.getByRole('button', { name: /próxima página/i }));
    expect(screen.getByText(/exibindo 11–20 de 42/i)).toBeInTheDocument();
  });
});

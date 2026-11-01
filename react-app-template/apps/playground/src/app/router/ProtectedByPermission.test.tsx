import { PermissionProvider } from '@hmk/react-admin-kit/authorization';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';

import { ProtectedByPermission } from './ProtectedByPermission';

function renderGuard(permissions: string[]) {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: (
          <ProtectedByPermission permission="dashboard:view">
            <h1>Conteúdo protegido</h1>
          </ProtectedByPermission>
        ),
      },
    ],
    { initialEntries: ['/'] },
  );
  return render(
    <PermissionProvider permissions={permissions}>
      <RouterProvider router={router} />
    </PermissionProvider>,
  );
}

describe('ProtectedByPermission', () => {
  it('renderiza o conteúdo quando o usuário tem a permissão', () => {
    renderGuard(['dashboard:view']);
    expect(screen.getByRole('heading', { name: /conteúdo protegido/i })).toBeInTheDocument();
  });

  it('exibe acesso negado (403) quando falta a permissão', () => {
    renderGuard([]);
    expect(screen.getByRole('heading', { name: /acesso negado/i })).toBeInTheDocument();
    expect(screen.queryByText(/conteúdo protegido/i)).not.toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Can } from './Can';
import { PermissionProvider } from './PermissionProvider';

function renderWithPermissions(permissions: string[], ui: React.ReactNode) {
  return render(<PermissionProvider permissions={permissions}>{ui}</PermissionProvider>);
}

describe('Can', () => {
  it('renderiza os filhos quando a permissão está presente', () => {
    renderWithPermissions(
      ['products:create'],
      <Can permission="products:create">
        <button>Novo produto</button>
      </Can>,
    );
    expect(screen.getByRole('button', { name: /novo produto/i })).toBeInTheDocument();
  });

  it('oculta os filhos quando falta a permissão', () => {
    renderWithPermissions(
      [],
      <Can permission="products:create">
        <button>Novo produto</button>
      </Can>,
    );
    expect(screen.queryByRole('button', { name: /novo produto/i })).not.toBeInTheDocument();
  });

  it('exibe o fallback quando falta a permissão', () => {
    renderWithPermissions(
      ['products:read'],
      <Can permission="products:create" fallback={<span>Sem acesso</span>}>
        <button>Novo produto</button>
      </Can>,
    );
    expect(screen.getByText(/sem acesso/i)).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Button } from '../button/Button';

import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('exibe título, descrição e ação', () => {
    render(
      <EmptyState
        title="Nenhum produto cadastrado"
        description="Cadastre o primeiro produto para começar."
        action={<Button>Cadastrar produto</Button>}
      />,
    );

    expect(screen.getByText(/nenhum produto cadastrado/i)).toBeInTheDocument();
    expect(screen.getByText(/cadastre o primeiro produto/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cadastrar produto/i })).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Label } from '../label/Label';

import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('associa label e alterna o estado por clique', async () => {
    render(
      <div>
        <Checkbox id="terms" />
        <Label htmlFor="terms">Aceito os termos</Label>
      </div>,
    );

    const checkbox = screen.getByRole('checkbox', { name: /aceito os termos/i });
    expect(checkbox).not.toBeChecked();

    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('alterna por teclado (espaço)', async () => {
    render(<Checkbox aria-label="Ativar" />);

    const checkbox = screen.getByRole('checkbox', { name: /ativar/i });
    await userEvent.tab();
    expect(checkbox).toHaveFocus();

    await userEvent.keyboard(' ');
    expect(checkbox).toBeChecked();
  });

  it('não alterna quando desabilitado', async () => {
    render(<Checkbox aria-label="Bloqueado" disabled />);

    const checkbox = screen.getByRole('checkbox', { name: /bloqueado/i });
    await userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Label } from '../label/Label';

import { Input } from './Input';

describe('Input', () => {
  it('associa label e aceita digitação', async () => {
    render(
      <div>
        <Label htmlFor="name">Nome</Label>
        <Input id="name" />
      </div>,
    );

    const input = screen.getByLabelText(/nome/i);
    await userEvent.type(input, 'Freio');

    expect(input).toHaveValue('Freio');
  });

  it('expõe estado inválido de forma acessível', () => {
    render(
      <div>
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" aria-invalid="true" aria-describedby="email-error" />
        <span id="email-error">E-mail inválido</span>
      </div>,
    );

    expect(screen.getByLabelText(/e-mail/i)).toHaveAttribute('aria-invalid', 'true');
  });

  it('não aceita digitação quando desabilitado', async () => {
    render(
      <div>
        <Label htmlFor="locked">Bloqueado</Label>
        <Input id="locked" disabled />
      </div>,
    );

    const input = screen.getByLabelText(/bloqueado/i);
    await userEvent.type(input, 'x');
    expect(input).toHaveValue('');
  });
});

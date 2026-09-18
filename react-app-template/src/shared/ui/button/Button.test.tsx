import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './Button';

describe('Button', () => {
  it('renderiza o rótulo e dispara o clique', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Salvar</Button>);

    await userEvent.click(screen.getByRole('button', { name: /salvar/i }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('impede clique quando está em loading', async () => {
    const onClick = vi.fn();
    render(
      <Button isLoading onClick={onClick}>
        Salvar
      </Button>,
    );

    const button = screen.getByRole('button', { name: /salvar/i });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');

    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('não dispara clique quando desabilitado', async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Salvar
      </Button>,
    );

    await userEvent.click(screen.getByRole('button', { name: /salvar/i }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('é acionável por teclado', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Enviar</Button>);

    await userEvent.tab();
    expect(screen.getByRole('button', { name: /enviar/i })).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';

import { ThemeProvider } from './ThemeProvider';
import { ThemeToggle } from './ThemeToggle';

function renderToggle() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>,
  );
}

afterEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('dark');
});

describe('ThemeToggle', () => {
  it('aplica o tema escuro ao selecionar a opção correspondente', async () => {
    renderToggle();

    await userEvent.click(screen.getByRole('button', { name: 'Tema escuro' }));

    expect(document.documentElement).toHaveClass('dark');
  });

  it('remove o tema escuro ao selecionar o tema claro', async () => {
    renderToggle();

    await userEvent.click(screen.getByRole('button', { name: 'Tema escuro' }));
    await userEvent.click(screen.getByRole('button', { name: 'Tema claro' }));

    expect(document.documentElement).not.toHaveClass('dark');
  });

  it('persiste a preferência escolhida', async () => {
    renderToggle();

    await userEvent.click(screen.getByRole('button', { name: 'Tema escuro' }));

    expect(localStorage.getItem('theme-preference')).toBe('dark');
  });

  it('marca a opção ativa com aria-pressed', async () => {
    renderToggle();

    await userEvent.click(screen.getByRole('button', { name: 'Tema escuro' }));

    expect(screen.getByRole('button', { name: 'Tema escuro' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});

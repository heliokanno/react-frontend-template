import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Button } from '../button/Button';

import { ToastProvider } from './ToastProvider';
import { useToast } from './useToast';

function Trigger() {
  const { toast } = useToast();
  return (
    <Button onClick={() => toast({ title: 'Produto salvo', variant: 'success' })}>Salvar</Button>
  );
}

describe('Toast', () => {
  it('exibe um toast anunciável ao disparar', async () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: /salvar/i }));

    const status = await screen.findByRole('status');
    expect(status).toHaveTextContent(/produto salvo/i);
  });

  it('permite fechar o toast', async () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: /salvar/i }));
    await userEvent.click(await screen.findByRole('button', { name: /fechar notificação/i }));

    expect(screen.queryByText(/produto salvo/i)).not.toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Button } from '../button/Button';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './Dialog';

function Example() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Abrir</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar ação</DialogTitle>
          <DialogDescription>Esta ação precisa de confirmação.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

describe('Dialog', () => {
  it('abre ao acionar o gatilho e expõe role dialog', async () => {
    render(<Example />);

    await userEvent.click(screen.getByRole('button', { name: /abrir/i }));

    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveTextContent(/confirmar ação/i);
  });

  it('fecha ao pressionar Escape e devolve o foco ao gatilho', async () => {
    render(<Example />);

    const trigger = screen.getByRole('button', { name: /abrir/i });
    await userEvent.click(trigger);
    expect(await screen.findByRole('dialog')).toBeInTheDocument();

    await userEvent.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});

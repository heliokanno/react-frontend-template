import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Button } from '../button/Button';

import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from './Dropdown';

function Example() {
  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button>Ações</Button>
      </DropdownTrigger>
      <DropdownContent>
        <DropdownItem>Editar</DropdownItem>
        <DropdownItem>Excluir</DropdownItem>
      </DropdownContent>
    </Dropdown>
  );
}

// A abertura do menu e a navegação por teclado do Radix DropdownMenu dependem
// de APIs de ponteiro/layout que o jsdom não implementa de forma confiável.
// Esse fluxo é coberto por E2E (Playwright, navegador real). Aqui validamos o
// que é observável de forma determinística em jsdom.
describe('Dropdown', () => {
  it('renderiza o gatilho acessível no estado fechado', () => {
    render(<Example />);

    const trigger = screen.getByRole('button', { name: /ações/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
  });
});

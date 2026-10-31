import { MoreHorizontal } from 'lucide-react';
import { type ReactNode } from 'react';

import { Button } from '@/shared/ui/button/Button';
import { Dropdown, DropdownContent, DropdownTrigger } from '@/shared/ui/dropdown/Dropdown';

type DataGridRowActionsProps = {
  /** Rótulo acessível do menu (ex.: "Ações da linha Freio"). */
  readonly label?: string;
  readonly children: ReactNode;
};

/**
 * Menu de ações por linha, sobre o Dropdown (teclado/acessibilidade herdados).
 * Os itens (`DropdownItem`) são fornecidos pela feature.
 */
export function DataGridRowActions({ label = 'Ações', children }: DataGridRowActionsProps) {
  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={label}>
          <MoreHorizontal aria-hidden="true" className="h-4 w-4" />
        </Button>
      </DropdownTrigger>
      <DropdownContent align="end">{children}</DropdownContent>
    </Dropdown>
  );
}

import { Search } from 'lucide-react';
import { type ReactNode } from 'react';

import { Input } from '@/shared/ui/input/Input';
import { Label } from '@/shared/ui/label/Label';

type DataGridToolbarProps = {
  readonly search: string;
  readonly onSearchChange: (value: string) => void;
  readonly searchPlaceholder?: string;
  /** Filtros adicionais por coluna, fornecidos pela feature. */
  readonly children?: ReactNode;
};

/** Barra de ferramentas do grid: busca textual e slot para filtros por coluna. */
export function DataGridToolbar({
  search,
  onSearchChange,
  searchPlaceholder = 'Buscar...',
  children,
}: DataGridToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 sm:max-w-xs">
        <Label htmlFor="data-grid-search" className="sr-only">
          Buscar
        </Label>
        <Search
          aria-hidden="true"
          className="text-text-muted pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2"
        />
        <Input
          id="data-grid-search"
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          className="pl-8"
        />
      </div>
      {children}
    </div>
  );
}

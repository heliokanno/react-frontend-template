import { type Column } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/shared/ui/cn';

type DataGridColumnHeaderProps<TData, TValue> = {
  readonly column: Column<TData, TValue>;
  readonly title: string;
  readonly className?: string;
};

/**
 * Cabeçalho de coluna com ordenação acessível. Expõe o estado via `aria-sort`
 * no `<th>` (feito pelo DataGrid) e alterna a direção ao clicar/teclar.
 */
export function DataGridColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataGridColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <span className={className}>{title}</span>;
  }

  const sorted = column.getIsSorted();
  const Icon = sorted === 'asc' ? ArrowUp : sorted === 'desc' ? ArrowDown : ChevronsUpDown;

  return (
    <button
      type="button"
      onClick={() => column.toggleSorting(sorted === 'asc')}
      className={cn(
        'text-text-secondary hover:text-text-primary inline-flex items-center gap-1.5 font-medium',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]',
        className,
      )}
    >
      {title}
      <Icon aria-hidden="true" className="h-3.5 w-3.5" />
    </button>
  );
}

/** Mapeia o estado de ordenação para o valor de `aria-sort` do `<th>`. */
export function toAriaSort(sorted: false | 'asc' | 'desc'): 'ascending' | 'descending' | 'none' {
  if (sorted === 'asc') return 'ascending';
  if (sorted === 'desc') return 'descending';
  return 'none';
}

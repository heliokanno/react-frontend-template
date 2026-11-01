import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
  type SortingState,
} from '@tanstack/react-table';
import { type ReactNode } from 'react';

import { toAriaSort } from './DataGridColumnHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table-primitives';

import type { AppError } from '@/infrastructure/errors/AppError';
import { EmptyState } from '@/shared/ui/empty-state/EmptyState';
import { ErrorState } from '@/shared/ui/error-state/ErrorState';
import { Skeleton } from '@/shared/ui/skeleton/Skeleton';

type DataGridProps<TData> = {
  readonly columns: ColumnDef<TData, unknown>[];
  readonly data: readonly TData[];
  readonly getRowId: (row: TData) => string;

  /** Estado de carregamento: exibe skeleton de linhas. */
  readonly isLoading?: boolean;
  /** Erro de dados: exibe estado de erro com retry. */
  readonly error?: AppError | null;
  readonly onRetry?: () => void;

  /** Ordenação controlada (server-side por padrão). */
  readonly sorting?: SortingState;
  readonly onSortingChange?: (sorting: SortingState) => void;

  /** Seleção controlada de linhas. */
  readonly rowSelection?: RowSelectionState;
  readonly onRowSelectionChange?: (selection: RowSelectionState) => void;

  /** Ordenação/paginação manuais (server-side). Padrão: true. */
  readonly manualSorting?: boolean;

  /** Customização dos estados vazios. */
  readonly emptyState?: ReactNode;
  readonly rowSkeletonCount?: number;
};

/**
 * Data Grid reutilizável do núcleo, sobre TanStack Table. Composável: a feature
 * fornece `columns` e `data`; o grid não conhece o domínio (ver
 * `.kiro/steering/frontend-architecture.md` → Reusability). Trata loading,
 * empty e error, e é responsivo (scroll horizontal controlado).
 */
export function DataGrid<TData>({
  columns,
  data,
  getRowId,
  isLoading = false,
  error = null,
  onRetry,
  sorting,
  onSortingChange,
  rowSelection,
  onRowSelectionChange,
  manualSorting = true,
  emptyState,
  rowSkeletonCount = 5,
}: DataGridProps<TData>) {
  const table = useReactTable({
    data: data as TData[],
    columns,
    getRowId,
    getCoreRowModel: getCoreRowModel(),
    manualSorting,
    manualPagination: true,
    enableRowSelection: rowSelection !== undefined,
    state: {
      ...(sorting !== undefined ? { sorting } : {}),
      ...(rowSelection !== undefined ? { rowSelection } : {}),
    },
    ...(onSortingChange
      ? {
          onSortingChange: (updater) => {
            const next = typeof updater === 'function' ? updater(sorting ?? []) : updater;
            onSortingChange(next);
          },
        }
      : {}),
    ...(onRowSelectionChange
      ? {
          onRowSelectionChange: (updater) => {
            const next = typeof updater === 'function' ? updater(rowSelection ?? {}) : updater;
            onRowSelectionChange(next);
          },
        }
      : {}),
  });

  const columnCount = table.getAllLeafColumns().length;

  if (error) {
    return <ErrorState {...(onRetry ? { onRetry } : {})} />;
  }

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                aria-sort={
                  header.column.getCanSort() ? toAriaSort(header.column.getIsSorted()) : undefined
                }
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {isLoading
          ? Array.from({ length: rowSkeletonCount }).map((_, rowIndex) => (
              <TableRow key={`skeleton-${rowIndex}`}>
                {Array.from({ length: columnCount }).map((__, cellIndex) => (
                  <TableCell key={`skeleton-${rowIndex}-${cellIndex}`}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          : null}

        {!isLoading && data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columnCount} className="py-8">
              {emptyState ?? <EmptyState title="Nenhum resultado encontrado" />}
            </TableCell>
          </TableRow>
        ) : null}

        {!isLoading &&
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} data-selected={row.getIsSelected() || undefined}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}

export type { DataGridProps };

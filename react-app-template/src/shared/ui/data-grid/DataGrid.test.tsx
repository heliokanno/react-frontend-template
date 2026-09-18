import { type ColumnDef } from '@tanstack/react-table';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { DataGrid } from './DataGrid';
import { DataGridColumnHeader } from './DataGridColumnHeader';

import { createAppError } from '@/infrastructure/errors/AppError';

type Row = { readonly id: string; readonly name: string };

const columns: ColumnDef<Row, unknown>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataGridColumnHeader column={column} title="Nome" />,
  },
];

const data: Row[] = [
  { id: '1', name: 'Alfa' },
  { id: '2', name: 'Beta' },
];

describe('DataGrid', () => {
  it('renderiza as linhas com semântica de tabela', () => {
    render(<DataGrid columns={columns} data={data} getRowId={(r) => r.id} />);

    const table = screen.getByRole('table');
    expect(within(table).getByText('Alfa')).toBeInTheDocument();
    expect(within(table).getByText('Beta')).toBeInTheDocument();
  });

  it('exibe skeleton no estado de loading', () => {
    const { container } = render(
      <DataGrid columns={columns} data={[]} getRowId={(r) => r.id} isLoading />,
    );
    // As linhas de skeleton usam animação de pulse.
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });

  it('exibe empty state quando não há dados', () => {
    render(<DataGrid columns={columns} data={[]} getRowId={(r) => r.id} />);
    expect(screen.getByText(/nenhum resultado encontrado/i)).toBeInTheDocument();
  });

  it('exibe estado de erro com retry', async () => {
    const onRetry = vi.fn();
    render(
      <DataGrid
        columns={columns}
        data={[]}
        getRowId={(r) => r.id}
        error={createAppError('server', { status: 500 })}
        onRetry={onRetry}
      />,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /tentar novamente/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('expõe aria-sort na coluna ordenável e alterna ao clicar', async () => {
    const onSortingChange = vi.fn();
    render(
      <DataGrid
        columns={columns}
        data={data}
        getRowId={(r) => r.id}
        sorting={[]}
        onSortingChange={onSortingChange}
      />,
    );

    const header = screen.getByRole('columnheader', { name: /nome/i });
    expect(header).toHaveAttribute('aria-sort', 'none');

    await userEvent.click(screen.getByRole('button', { name: /nome/i }));
    expect(onSortingChange).toHaveBeenCalled();
  });
});

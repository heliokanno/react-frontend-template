import { type ColumnDef, type SortingState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';

import {
  Badge,
  DataGrid,
  DataGridColumnHeader,
  DataGridPagination,
  DataGridToolbar,
  useDataGridUrlState,
} from '@/shared/ui';

type DemoUser = {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly status: 'active' | 'inactive';
};

const USERS: readonly DemoUser[] = Array.from({ length: 42 }, (_, index) => ({
  id: String(index + 1),
  name: `Usuário ${index + 1}`,
  email: `usuario${index + 1}@exemplo.com`,
  status: index % 3 === 0 ? 'inactive' : 'active',
}));

const columns: ColumnDef<DemoUser, unknown>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataGridColumnHeader column={column} title="Nome" />,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataGridColumnHeader column={column} title="E-mail" />,
  },
  {
    accessorKey: 'status',
    enableSorting: false,
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.original.status === 'active' ? 'success' : 'neutral'}>
        {row.original.status === 'active' ? 'Ativo' : 'Inativo'}
      </Badge>
    ),
  },
];

/**
 * Página de exemplo do Data Grid: demonstra busca, ordenação, paginação e URL
 * state com dados locais. Valida a composição do grid (a feature fornece
 * colunas e dados). Um CRUD real via API é entregue na spec 012.
 */
export function DataGridExamplePage() {
  const url = useDataGridUrlState();
  const [sorting, setSorting] = useState<SortingState>([]);

  // Filtragem, ordenação e paginação client-side (exemplo). Em uma feature real
  // esses parâmetros iriam para a query server-side (ver spec 012).
  const filtered = useMemo(() => {
    const term = url.search.trim().toLowerCase();
    const base = term
      ? USERS.filter(
          (user) =>
            user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term),
        )
      : USERS;

    const sort = sorting[0];
    if (!sort) return base;
    const key = sort.id as keyof DemoUser;
    return [...base].sort((a, b) => {
      const compare = String(a[key]).localeCompare(String(b[key]));
      return sort.desc ? -compare : compare;
    });
  }, [url.search, sorting]);

  const totalItems = filtered.length;
  const pageData = filtered.slice((url.page - 1) * url.pageSize, url.page * url.pageSize);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4 p-6">
      <h1 className="text-text-primary text-3xl font-bold">Data Grid</h1>
      <p className="text-text-secondary">
        Exemplo com busca, ordenação, paginação e estado na URL.
      </p>

      <DataGridToolbar search={url.search} onSearchChange={url.setSearch} />

      <DataGrid<DemoUser>
        columns={columns}
        data={pageData}
        getRowId={(row) => row.id}
        sorting={sorting}
        onSortingChange={setSorting}
      />

      <DataGridPagination
        page={url.page}
        pageSize={url.pageSize}
        totalItems={totalItems}
        onPageChange={url.setPage}
      />
    </div>
  );
}

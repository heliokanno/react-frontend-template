import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/shared/ui/button/Button';

type DataGridPaginationProps = {
  readonly page: number;
  readonly pageSize: number;
  readonly totalItems: number;
  readonly onPageChange: (page: number) => void;
};

/** Paginação do grid, com contagem acessível e navegação anterior/próxima. */
export function DataGridPagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
}: DataGridPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const from = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-text-secondary text-sm" aria-live="polite">
        {totalItems === 0 ? 'Nenhum resultado' : `Exibindo ${from}–${to} de ${totalItems}`}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          aria-label="Página anterior"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft aria-hidden="true" className="h-4 w-4" />
          Anterior
        </Button>
        <span className="text-text-secondary text-sm">
          Página {page} de {totalPages}
        </span>
        <Button
          variant="secondary"
          size="sm"
          aria-label="Próxima página"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Próxima
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

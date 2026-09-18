import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';

/**
 * Estado navegável do grid, refletido na URL: busca, página, tamanho de página
 * e ordenação. Sobrevive a refresh, é compartilhável e navegável pelo histórico
 * (ver `.kiro/steering/frontend-architecture.md` → URL State).
 */
export type DataGridUrlState = {
  readonly search: string;
  readonly page: number;
  readonly pageSize: number;
  readonly sortBy: string | undefined;
  readonly sortDir: 'asc' | 'desc' | undefined;
};

export type DataGridUrlStateActions = {
  readonly setSearch: (search: string) => void;
  readonly setPage: (page: number) => void;
  readonly setSort: (sortBy: string | undefined, sortDir: 'asc' | 'desc' | undefined) => void;
};

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

function parsePositiveInt(value: string | null, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function useDataGridUrlState(): DataGridUrlState & DataGridUrlStateActions {
  const [searchParams, setSearchParams] = useSearchParams();

  const state = useMemo<DataGridUrlState>(() => {
    const sortDirParam = searchParams.get('sortDir');
    return {
      search: searchParams.get('search') ?? '',
      page: parsePositiveInt(searchParams.get('page'), DEFAULT_PAGE),
      pageSize: parsePositiveInt(searchParams.get('pageSize'), DEFAULT_PAGE_SIZE),
      sortBy: searchParams.get('sortBy') ?? undefined,
      sortDir: sortDirParam === 'asc' || sortDirParam === 'desc' ? sortDirParam : undefined,
    };
  }, [searchParams]);

  const update = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          mutate(next);
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setSearch = useCallback(
    (search: string) => {
      update((params) => {
        if (search) params.set('search', search);
        else params.delete('search');
        // Nova busca volta para a primeira página.
        params.delete('page');
      });
    },
    [update],
  );

  const setPage = useCallback(
    (page: number) => {
      update((params) => {
        if (page > 1) params.set('page', String(page));
        else params.delete('page');
      });
    },
    [update],
  );

  const setSort = useCallback(
    (sortBy: string | undefined, sortDir: 'asc' | 'desc' | undefined) => {
      update((params) => {
        if (sortBy && sortDir) {
          params.set('sortBy', sortBy);
          params.set('sortDir', sortDir);
        } else {
          params.delete('sortBy');
          params.delete('sortDir');
        }
      });
    },
    [update],
  );

  return { ...state, setSearch, setPage, setSort };
}

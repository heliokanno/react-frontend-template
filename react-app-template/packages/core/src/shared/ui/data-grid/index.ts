/**
 * Data Grid reutilizável do núcleo (spec 006). Composável sobre TanStack Table:
 * a feature fornece colunas e dados; o grid trata ordenação, seleção, estados e
 * responsividade. Filtros/paginação/URL state são compostos pela feature.
 */

export { DataGrid, type DataGridProps } from './DataGrid';
export { DataGridColumnHeader, toAriaSort } from './DataGridColumnHeader';
export { DataGridToolbar } from './DataGridToolbar';
export { DataGridPagination } from './DataGridPagination';
export { DataGridRowActions } from './DataGridRowActions';
export {
  useDataGridUrlState,
  type DataGridUrlState,
  type DataGridUrlStateActions,
} from './useDataGridUrlState';
export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './table-primitives';

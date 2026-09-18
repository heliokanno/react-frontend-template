import { type HTMLAttributes, type TdHTMLAttributes, type ThHTMLAttributes } from 'react';

import { cn } from '@/shared/ui/cn';

/**
 * Primitivos de tabela com semântica HTML nativa (`table`, `thead`, `tr`,
 * `th`, `td`). Estilizados por tokens. Compostos pelo DataGrid.
 */

export function Table({ className, ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="relative w-full overflow-x-auto">
      <table
        className={cn('w-full caption-bottom border-collapse text-sm', className)}
        {...props}
      />
    </div>
  );
}

export function TableHeader({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn('border-border-default border-b', className)} {...props} />;
}

export function TableBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={className} {...props} />;
}

export function TableRow({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        'border-border-default hover:bg-surface-subtle border-b transition-colors',
        'data-[selected=true]:bg-surface-subtle',
        className,
      )}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        'text-text-secondary h-11 px-3 text-left align-middle text-xs font-medium',
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn('text-text-primary px-3 py-2.5 align-middle', className)} {...props} />;
}

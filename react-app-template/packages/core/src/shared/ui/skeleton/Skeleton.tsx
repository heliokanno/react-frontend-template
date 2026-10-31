import { type HTMLAttributes } from 'react';

import { cn } from '@/shared/ui/cn';

/** Placeholder de carregamento. Decorativo: oculto de tecnologias assistivas. */
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn('bg-surface-subtle animate-pulse rounded-md', className)}
      {...props}
    />
  );
}

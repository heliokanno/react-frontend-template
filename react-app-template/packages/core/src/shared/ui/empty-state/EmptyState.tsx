import { type ComponentType, type ReactNode } from 'react';

import { cn } from '@/shared/ui/cn';

type EmptyStateProps = {
  /** Ícone opcional (decorativo). */
  readonly icon?: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  readonly title: string;
  readonly description?: string;
  /** Ação natural (ex.: um Button para criar o primeiro registro). */
  readonly action?: ReactNode;
  readonly className?: string;
};

/**
 * Estado vazio: explica o que está vazio e oferece a ação natural quando houver
 * (ver `.kiro/steering/ux-design.md` → Empty States). Evita telas puramente
 * decorativas.
 */
export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'border-border-default flex flex-col items-center justify-center gap-3 rounded-md border border-dashed p-8 text-center',
        className,
      )}
    >
      {Icon ? <Icon aria-hidden className="text-text-muted h-10 w-10" /> : null}
      <div className="flex flex-col gap-1">
        <p className="text-text-primary font-medium">{title}</p>
        {description ? <p className="text-text-secondary text-sm">{description}</p> : null}
      </div>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}

export type { EmptyStateProps };

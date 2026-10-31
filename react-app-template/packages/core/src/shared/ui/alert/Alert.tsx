import { cva, type VariantProps } from 'class-variance-authority';
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react';
import { type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/shared/ui/cn';

const alertVariants = cva('flex gap-3 rounded-md border p-4 text-sm', {
  variants: {
    variant: {
      info: 'border-feedback-info/30 bg-feedback-info-surface text-text-primary',
      success: 'border-feedback-success/30 bg-feedback-success-surface text-text-primary',
      warning: 'border-feedback-warning/30 bg-feedback-warning-surface text-text-primary',
      error: 'border-feedback-error/30 bg-feedback-error-surface text-text-primary',
    },
  },
  defaultVariants: { variant: 'info' },
});

const ICONS = {
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  error: AlertCircle,
} as const;

const ICON_COLORS = {
  info: 'text-feedback-info',
  success: 'text-feedback-success',
  warning: 'text-feedback-warning',
  error: 'text-feedback-error',
} as const;

type AlertVariant = NonNullable<VariantProps<typeof alertVariants>['variant']>;

type AlertProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof alertVariants> & {
    /** Título curto opcional. */
    readonly title?: string;
    readonly children?: ReactNode;
  };

/**
 * Mensagem contextual inline. A intenção é comunicada por ícone + texto, não
 * apenas por cor (ver `frontend-engineering.md` → Color Accessibility).
 */
export function Alert({ className, variant = 'info', title, children, ...props }: AlertProps) {
  const resolved: AlertVariant = variant ?? 'info';
  const Icon = ICONS[resolved];

  return (
    <div role="alert" className={cn(alertVariants({ variant }), className)} {...props}>
      <Icon aria-hidden="true" className={cn('mt-0.5 h-5 w-5 shrink-0', ICON_COLORS[resolved])} />
      <div className="flex flex-col gap-1">
        {title ? <p className="font-medium">{title}</p> : null}
        {children ? <div className="text-text-secondary">{children}</div> : null}
      </div>
    </div>
  );
}

export type { AlertProps };

import { cva, type VariantProps } from 'class-variance-authority';
import { type HTMLAttributes } from 'react';

import { cn } from '@/shared/ui/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        neutral: 'bg-surface-subtle text-text-secondary',
        accent: 'bg-action-primary text-text-on-accent',
        success: 'bg-feedback-success-surface text-feedback-success',
        warning: 'bg-feedback-warning-surface text-feedback-warning',
        error: 'bg-feedback-error-surface text-feedback-error',
      },
    },
    defaultVariants: { variant: 'neutral' },
  },
);

type BadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

/** Etiqueta compacta para status/categorias. */
export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export type { BadgeProps };

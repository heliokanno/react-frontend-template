import { forwardRef, type InputHTMLAttributes } from 'react';

import { cn } from '@/shared/ui/cn';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

/**
 * Campo de texto de linha única. Estados de foco, disabled e inválido
 * (`aria-invalid`) são comunicados visualmente. O label é responsabilidade
 * do consumidor (associar via `htmlFor`/`id`); ver spec 007 para o FormField.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        'border-border-default bg-surface-default flex h-10 w-full rounded-md border px-3 py-2 text-sm',
        'text-text-primary placeholder:text-text-muted',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'aria-[invalid=true]:border-feedback-error',
        className,
      )}
      {...props}
    />
  );
});

export type { InputProps };

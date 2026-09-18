import { forwardRef, type TextareaHTMLAttributes } from 'react';

import { cn } from '@/shared/ui/cn';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

/** Campo de texto multi-linha, com os mesmos estados acessíveis do Input. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        'border-border-default bg-surface-default flex min-h-20 w-full rounded-md border px-3 py-2 text-sm',
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

export type { TextareaProps };

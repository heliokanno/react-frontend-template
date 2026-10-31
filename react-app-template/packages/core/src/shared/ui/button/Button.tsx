import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from 'react';

import { cn } from '@/shared/ui/cn';

const buttonVariants = cva(
  cn(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md',
    'font-medium transition-colors',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]',
    'disabled:pointer-events-none disabled:opacity-50',
  ),
  {
    variants: {
      variant: {
        primary:
          'bg-action-primary text-text-on-accent hover:bg-action-primary-hover active:bg-action-primary-active',
        secondary:
          'border border-border-strong bg-surface-default text-text-primary hover:bg-surface-subtle',
        tertiary: 'text-text-primary hover:bg-surface-subtle',
        destructive: 'bg-feedback-error text-text-on-accent hover:opacity-90',
        ghost: 'text-text-secondary hover:bg-surface-subtle hover:text-text-primary',
        icon: 'text-text-secondary hover:bg-surface-subtle hover:text-text-primary',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-11 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    /** Renderiza como o filho (ex.: um link), preservando o estilo. */
    readonly asChild?: boolean;
    /** Exibe indicador de carregamento e bloqueia a interação. */
    readonly isLoading?: boolean;
    readonly children?: ReactNode;
  };

/**
 * Botão do Design System, com hierarquia por variante e estados completos.
 * Durante o loading, fica desabilitado para impedir submissões duplicadas.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, asChild = false, isLoading = false, disabled, children, ...props },
  ref,
) {
  if (asChild) {
    return (
      <Slot ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props}>
        {children}
      </Slot>
    );
  }

  return (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled ?? isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
});

export { buttonVariants };
export type { ButtonProps };

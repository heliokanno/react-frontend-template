import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';

import { cn } from '@/shared/ui/cn';

type CheckboxProps = ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>;

/** Caixa de seleção acessível (Radix). */
export const Checkbox = forwardRef<ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  function Checkbox({ className, ...props }, ref) {
    return (
      <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
          'peer border-border-strong h-5 w-5 shrink-0 rounded-sm border',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'data-[state=checked]:border-action-primary data-[state=checked]:bg-action-primary data-[state=checked]:text-text-on-accent',
          className,
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center">
          <Check aria-hidden="true" className="h-4 w-4" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );
  },
);

export type { CheckboxProps };

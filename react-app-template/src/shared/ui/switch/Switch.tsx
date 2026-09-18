import * as SwitchPrimitive from '@radix-ui/react-switch';
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';

import { cn } from '@/shared/ui/cn';

type SwitchProps = ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>;

/** Interruptor liga/desliga acessível (Radix). */
export const Switch = forwardRef<ElementRef<typeof SwitchPrimitive.Root>, SwitchProps>(
  function Switch({ className, ...props }, ref) {
    return (
      <SwitchPrimitive.Root
        ref={ref}
        className={cn(
          'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'data-[state=checked]:bg-action-primary data-[state=unchecked]:bg-border-strong',
          className,
        )}
        {...props}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            'bg-surface-default pointer-events-none block h-5 w-5 rounded-full shadow-sm transition-transform',
            'data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
          )}
        />
      </SwitchPrimitive.Root>
    );
  },
);

export type { SwitchProps };

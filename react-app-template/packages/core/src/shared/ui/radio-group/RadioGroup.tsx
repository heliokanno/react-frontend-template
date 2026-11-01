import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Circle } from 'lucide-react';
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';

import { cn } from '@/shared/ui/cn';

type RadioGroupProps = ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>;
type RadioGroupItemProps = ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>;

/** Grupo de opções mutuamente exclusivas (Radix). */
export const RadioGroup = forwardRef<ElementRef<typeof RadioGroupPrimitive.Root>, RadioGroupProps>(
  function RadioGroup({ className, ...props }, ref) {
    return (
      <RadioGroupPrimitive.Root ref={ref} className={cn('grid gap-2', className)} {...props} />
    );
  },
);

/** Opção individual do RadioGroup. */
export const RadioGroupItem = forwardRef<
  ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(function RadioGroupItem({ className, ...props }, ref) {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'border-border-strong text-action-primary aspect-square h-5 w-5 rounded-full border',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=checked]:border-action-primary',
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle
          aria-hidden="true"
          className="fill-action-primary text-action-primary h-2.5 w-2.5"
        />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});

export type { RadioGroupProps, RadioGroupItemProps };

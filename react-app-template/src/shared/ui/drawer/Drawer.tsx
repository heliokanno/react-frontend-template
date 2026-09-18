import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';

import { cn } from '@/shared/ui/cn';

/**
 * Drawer (painel lateral) sobre o Dialog do Radix: mesma gestão de foco,
 * retorno de foco e `Escape`. Desliza a partir de um lado. Composição análoga
 * ao Dialog. Útil para conteúdo contextual sem trocar de página.
 */
export const Drawer = DialogPrimitive.Root;
export const DrawerTrigger = DialogPrimitive.Trigger;
export const DrawerClose = DialogPrimitive.Close;

const DrawerOverlay = forwardRef<
  ElementRef<typeof DialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(function DrawerOverlay({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn('fixed inset-0 z-[var(--z-modal)] bg-black/50', className)}
      {...props}
    />
  );
});

type DrawerContentProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  readonly side?: 'left' | 'right';
};

export const DrawerContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  DrawerContentProps
>(function DrawerContent({ className, children, side = 'right', ...props }, ref) {
  return (
    <DialogPrimitive.Portal>
      <DrawerOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'border-border-default bg-surface-elevated fixed inset-y-0 z-[var(--z-modal)] flex w-full max-w-sm flex-col gap-4 p-6 shadow-lg',
          side === 'right' ? 'right-0 border-l' : 'left-0 border-r',
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          aria-label="Fechar"
          className="text-text-muted hover:text-text-primary absolute top-4 right-4 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});

export const DrawerTitle = forwardRef<
  ElementRef<typeof DialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(function DrawerTitle({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cn('text-text-primary text-lg font-semibold', className)}
      {...props}
    />
  );
});

export const DrawerDescription = forwardRef<
  ElementRef<typeof DialogPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(function DrawerDescription({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn('text-text-secondary text-sm', className)}
      {...props}
    />
  );
});

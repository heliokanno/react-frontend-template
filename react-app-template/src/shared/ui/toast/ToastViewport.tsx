import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';

import type { Toast, ToastVariant } from './toast-context';

import { cn } from '@/shared/ui/cn';

const ICONS = {
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  error: AlertCircle,
} as const;

const ICON_COLORS: Record<ToastVariant, string> = {
  info: 'text-feedback-info',
  success: 'text-feedback-success',
  warning: 'text-feedback-warning',
  error: 'text-feedback-error',
};

const DEFAULT_DURATION = 5000;

type ToastViewportProps = {
  readonly toasts: readonly Toast[];
  readonly onDismiss: (id: string) => void;
  readonly onPause: (id: string) => void;
  readonly onResume: (id: string, duration: number) => void;
};

/**
 * Região visual dos toasts. É anunciada por leitores de tela (`aria-live`).
 * O auto-dismiss é pausado ao passar o mouse ou focar, e retomado ao sair.
 */
export function ToastViewport({ toasts, onDismiss, onPause, onResume }: ToastViewportProps) {
  return (
    <div
      role="region"
      aria-label="Notificações"
      className="pointer-events-none fixed right-4 bottom-4 z-[var(--z-toast)] flex w-full max-w-sm flex-col gap-2"
    >
      {toasts.map((toast) => {
        const variant: ToastVariant = toast.variant ?? 'info';
        const Icon = ICONS[variant];
        const duration = toast.duration ?? DEFAULT_DURATION;

        return (
          <div
            key={toast.id}
            role="status"
            aria-live="polite"
            className={cn(
              'border-border-default bg-surface-elevated pointer-events-auto flex gap-3 rounded-md border p-4 shadow-lg',
            )}
            onMouseEnter={() => onPause(toast.id)}
            onMouseLeave={() => onResume(toast.id, duration)}
            onFocus={() => onPause(toast.id)}
            onBlur={() => onResume(toast.id, duration)}
          >
            <Icon
              aria-hidden="true"
              className={cn('mt-0.5 h-5 w-5 shrink-0', ICON_COLORS[variant])}
            />
            <div className="flex flex-1 flex-col gap-1">
              <p className="text-text-primary text-sm font-medium">{toast.title}</p>
              {toast.description ? (
                <p className="text-text-secondary text-sm">{toast.description}</p>
              ) : null}
            </div>
            <button
              type="button"
              aria-label="Fechar notificação"
              onClick={() => onDismiss(toast.id)}
              className="text-text-muted hover:text-text-primary shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

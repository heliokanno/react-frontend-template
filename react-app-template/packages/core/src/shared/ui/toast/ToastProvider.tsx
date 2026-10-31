import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';

import {
  ToastContext,
  type Toast,
  type ToastContextValue,
  type ToastOptions,
} from './toast-context';
import { ToastViewport } from './ToastViewport';

const DEFAULT_DURATION = 5000;

let counter = 0;
function nextId(): string {
  counter += 1;
  return `toast-${counter}`;
}

type ToastProviderProps = {
  readonly children: ReactNode;
};

/**
 * Provê o sistema de toasts. Mantém a fila, o auto-dismiss (pausável) e
 * renderiza a região acessível (`aria-live`). Ver `.kiro/steering/design-system.md`
 * → Feedback Components. Toast não substitui informação que precisa permanecer.
 */
export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<readonly Toast[]>([]);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const scheduleDismiss = useCallback(
    (id: string, duration: number) => {
      const timer = setTimeout(() => dismiss(id), duration);
      timers.current.set(id, timer);
    },
    [dismiss],
  );

  const pause = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = nextId();
      const duration = options.duration ?? DEFAULT_DURATION;
      setToasts((current) => [...current, { ...options, id }]);
      scheduleDismiss(id, duration);
      return id;
    },
    [scheduleDismiss],
  );

  const value = useMemo<ToastContextValue>(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext value={value}>
      {children}
      <ToastViewport
        toasts={toasts}
        onDismiss={dismiss}
        onPause={pause}
        onResume={(id, duration) => scheduleDismiss(id, duration)}
      />
    </ToastContext>
  );
}

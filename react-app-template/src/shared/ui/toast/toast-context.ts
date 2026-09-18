import { createContext } from 'react';

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

export type ToastOptions = {
  readonly title: string;
  readonly description?: string;
  readonly variant?: ToastVariant;
  /** Duração em ms até o auto-dismiss. Padrão 5000. */
  readonly duration?: number;
};

export type Toast = ToastOptions & { readonly id: string };

export type ToastContextValue = {
  /** Exibe um toast e retorna seu id. */
  readonly toast: (options: ToastOptions) => string;
  /** Remove um toast pelo id. */
  readonly dismiss: (id: string) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);

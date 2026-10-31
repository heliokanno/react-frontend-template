import { useContext } from 'react';

import { ToastContext, type ToastContextValue } from './toast-context';

/**
 * Acessa o disparo de toasts. Deve ser usado dentro de um `ToastProvider`.
 */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (context === null) {
    throw new Error('useToast deve ser usado dentro de um ToastProvider.');
  }
  return context;
}

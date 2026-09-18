import { RouterProvider } from 'react-router';

import { AppErrorBoundary } from '@/app/error/AppErrorBoundary';
import { AppProviders } from '@/app/providers/AppProviders';
import { router } from '@/app/router/router';

/**
 * Componente raiz: envolve a aplicação no boundary de erro e nos providers
 * globais, e monta o roteamento central.
 */
export function App() {
  return (
    <AppErrorBoundary>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </AppErrorBoundary>
  );
}

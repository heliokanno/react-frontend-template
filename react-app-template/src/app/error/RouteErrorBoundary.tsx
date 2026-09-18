import { isRouteErrorResponse, useRouteError } from 'react-router';

import { NotFoundPage } from './NotFoundPage';

import { ErrorState } from '@/shared/ui';

/**
 * Boundary de erro por rota (usado como `errorElement`). Uma falha ao carregar
 * ou renderizar uma rota é contida aqui, sem derrubar a aplicação inteira.
 * Erros 404 caem na página dedicada.
 */
export function RouteErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFoundPage />;
  }

  return (
    <div className="flex min-h-dvh items-center justify-center p-6">
      <ErrorState
        title="Não foi possível carregar esta página"
        description="Tente novamente ou volte mais tarde."
        onRetry={() => window.location.reload()}
      />
    </div>
  );
}

import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';

import { ROUTES } from './routes';

import { useAuth } from '@/features/auth';
import { Spinner } from '@/shared/ui';

type ProtectedRouteProps = {
  readonly children: ReactNode;
};

/**
 * Guard de rota protegida. Consome a sessão real via `useAuth` (008).
 * Enquanto a sessão carrega, exibe loading; sem sessão, redireciona ao login
 * preservando o destino original em `state.from`.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const session = useAuth();
  const location = useLocation();

  if (session.status === 'loading') {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Spinner label="Carregando sessão" />
      </div>
    );
  }

  if (session.status === 'unauthenticated') {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />;
  }

  return <>{children}</>;
}

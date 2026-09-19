import { type ReactNode } from 'react';
import { Navigate } from 'react-router';

import { ROUTES } from './routes';

import { useAuth } from '@/features/auth';

type PublicRouteProps = {
  readonly children: ReactNode;
};

/**
 * Rota pública (ex.: login). Se já houver sessão autenticada, redireciona para
 * a área interna, evitando que usuários logados vejam a tela de login.
 */
export function PublicRoute({ children }: PublicRouteProps) {
  const session = useAuth();

  if (session.status === 'authenticated') {
    return <Navigate to={ROUTES.dashboard} replace />;
  }

  return <>{children}</>;
}

import { type Permission, useHasPermission } from '@hmk/react-admin-kit/authorization';
import { type ReactNode } from 'react';

import { ForbiddenPage } from '@/app/error/ForbiddenPage';

type ProtectedByPermissionProps = {
  readonly permission: Permission;
  readonly children: ReactNode;
};

/**
 * Guard de rota por permissão. Sem a permissão exigida, exibe a página 403.
 * Deve ser usado dentro de uma rota já protegida por autenticação
 * (`ProtectedRoute`). É UX; a autorização real é do backend — um 403 vindo da
 * API (004) converge para a mesma experiência de acesso negado.
 */
export function ProtectedByPermission({ permission, children }: ProtectedByPermissionProps) {
  const allowed = useHasPermission(permission);
  if (!allowed) {
    return <ForbiddenPage />;
  }
  return <>{children}</>;
}

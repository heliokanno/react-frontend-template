import { type ReactNode } from 'react';

import { type Permission } from './permission';
import { useHasPermission } from './useHasPermission';

type CanProps = {
  /** Permissão exigida para renderizar os filhos. */
  readonly permission: Permission;
  /** Conteúdo exibido quando o usuário NÃO tem a permissão. */
  readonly fallback?: ReactNode;
  readonly children: ReactNode;
};

/**
 * Renderização condicional por permissão (gating declarativo). Lembrando: é UX,
 * não segurança — a autorização real é do backend
 * (ver `.kiro/steering/frontend-architecture.md` → Authorization).
 *
 * @example
 * <Can permission="products:create">
 *   <Button>Novo produto</Button>
 * </Can>
 */
export function Can({ permission, fallback = null, children }: CanProps) {
  const allowed = useHasPermission(permission);
  return <>{allowed ? children : fallback}</>;
}

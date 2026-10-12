import { useContext } from 'react';

import { hasPermission, type Permission } from './permission';
import { PermissionContext } from './permission-context';

/**
 * Verifica programaticamente se o usuário atual tem uma permissão.
 * Requer o `PermissionProvider`. Lembrando: isto é UX, não segurança.
 */
export function useHasPermission(permission: Permission): boolean {
  const context = useContext(PermissionContext);
  if (context === null) {
    throw new Error('useHasPermission deve ser usado dentro de um PermissionProvider.');
  }
  return hasPermission(context.permissions, permission);
}

import { useMemo, type ReactNode } from 'react';

import { PermissionContext, type PermissionContextValue } from './permission-context';

type PermissionProviderProps = {
  /** Permissões concedidas ao usuário atual. A origem (sessão) é injetada pela
   * camada `app`, mantendo `shared/authorization` livre de acoplamento a features. */
  readonly permissions: readonly string[];
  readonly children: ReactNode;
};

/** Disponibiliza as permissões do usuário à árvore de componentes. */
export function PermissionProvider({ permissions, children }: PermissionProviderProps) {
  const value = useMemo<PermissionContextValue>(() => ({ permissions }), [permissions]);
  return <PermissionContext value={value}>{children}</PermissionContext>;
}

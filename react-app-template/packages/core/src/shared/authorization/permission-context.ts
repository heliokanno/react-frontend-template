import { createContext } from 'react';

export type PermissionContextValue = {
  /** Permissões concedidas ao usuário atual (vazias quando não autenticado). */
  readonly permissions: readonly string[];
};

export const PermissionContext = createContext<PermissionContextValue | null>(null);

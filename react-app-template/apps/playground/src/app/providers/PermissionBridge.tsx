import { useCurrentUser } from '@hmk/react-admin-kit/auth';
import { PermissionProvider } from '@hmk/react-admin-kit/authorization';
import { type ReactNode } from 'react';

type PermissionBridgeProps = {
  readonly children: ReactNode;
};

/**
 * Liga as permissões da sessão (feature auth) ao `PermissionProvider` do núcleo.
 * Fica na camada `app` para que `shared/authorization` não dependa da feature.
 */
export function PermissionBridge({ children }: PermissionBridgeProps) {
  const user = useCurrentUser();
  return <PermissionProvider permissions={user?.permissions ?? []}>{children}</PermissionProvider>;
}

import { type ReactNode } from 'react';

import { useContainer } from '@/app/di/useContainer';
import { AuthProvider } from '@/features/auth';

type SessionProviderProps = {
  readonly children: ReactNode;
};

/**
 * Liga o `AuthProvider` da feature de auth às dependências do composition root.
 * Fica na camada `app` para conectar a feature à DI sem que a feature conheça o
 * container.
 */
export function SessionProvider({ children }: SessionProviderProps) {
  const { auth } = useContainer();
  return (
    <AuthProvider
      login={auth.login}
      logout={auth.logout}
      refreshSession={auth.refreshSession}
      tokenStorage={auth.tokenStorage}
      tokenHolder={auth.tokenHolder}
    >
      {children}
    </AuthProvider>
  );
}

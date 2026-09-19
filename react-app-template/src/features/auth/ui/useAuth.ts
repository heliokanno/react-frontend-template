import { useContext } from 'react';

import { AuthContext, type AuthContextValue } from './auth-context';

/** Acessa o estado e as ações de sessão. Requer o `AuthProvider`. */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider.');
  }
  return context;
}

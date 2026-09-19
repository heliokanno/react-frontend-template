import { createContext } from 'react';

import type { CurrentUser, Credentials } from '@/features/auth/domain/Session';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export type AuthContextValue = {
  readonly status: AuthStatus;
  readonly user: CurrentUser | null;
  /** Autentica; lança em caso de erro (tratado pela UI de login). */
  readonly login: (credentials: Credentials) => Promise<void>;
  readonly logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

import { useAuth } from './useAuth';

import type { CurrentUser } from '@/features/auth/domain/Session';

/** Retorna o usuário autenticado atual, ou `null` se não houver sessão. */
export function useCurrentUser(): CurrentUser | null {
  return useAuth().user;
}

import type { RequestInterceptor } from '@/infrastructure/http/HttpClient';

/**
 * Fonte do token de acesso corrente. A UI/sessão atualiza o token aqui; o
 * interceptor de request o lê para anexar o header. Assim os componentes não
 * manipulam token diretamente (ver `.kiro/steering/frontend-engineering.md`
 * → Authentication).
 */
export type AccessTokenHolder = {
  get: () => string | null;
  set: (token: string | null) => void;
};

export function createAccessTokenHolder(): AccessTokenHolder {
  let token: string | null = null;
  return {
    get: () => token,
    set: (next) => {
      token = next;
    },
  };
}

/** Interceptor de request que anexa `Authorization: Bearer <token>` quando houver. */
export function createAuthRequestInterceptor(holder: AccessTokenHolder): RequestInterceptor {
  return (init) => {
    const token = holder.get();
    if (!token) return init;
    return {
      ...init,
      headers: {
        ...init.headers,
        Authorization: `Bearer ${token}`,
      },
    };
  };
}

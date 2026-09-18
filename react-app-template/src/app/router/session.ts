/**
 * Abstração mínima de sessão consumida pelos guards de rota.
 *
 * Nesta spec (005) é um stub: o roteamento e a estrutura de proteção ficam
 * prontos, mas a lógica real de autenticação é injetada na spec 008, que
 * substitui esta implementação sem reescrever o roteamento.
 */
export type SessionStatus = 'authenticated' | 'unauthenticated' | 'loading';

export type Session = {
  readonly status: SessionStatus;
};

/**
 * Hook de sessão (stub). Retorna "unauthenticated" por padrão. A spec 008
 * substitui por uma implementação baseada em `useAuth`.
 *
 * Permite sobrescrever via variável de ambiente apenas para exercitar rotas
 * protegidas durante o desenvolvimento desta fundação.
 */
export function useSession(): Session {
  // Placeholder determinístico até a spec 008. Mantido simples e explícito.
  return { status: 'unauthenticated' };
}

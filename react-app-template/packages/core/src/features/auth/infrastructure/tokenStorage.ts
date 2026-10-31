import type { TokenStorage } from '@/features/auth/application/ports/TokenStorage';
import type { SessionTokens } from '@/features/auth/domain/Session';

const STORAGE_KEY = 'auth-tokens';

/**
 * Persistência dos tokens da sessão.
 *
 * TRADE-OFF DE SEGURANÇA: esta implementação usa `localStorage`, que é
 * conveniente e sobrevive a refresh, mas fica acessível a JavaScript (exposto a
 * XSS). Quando o backend suportar, prefira **cookies httpOnly** (imunes a
 * leitura por JS) — nesse caso os tokens não passam pelo frontend e este
 * storage pode ser substituído por um no-op. A escolha aqui prioriza um
 * template funcional; documente e ajuste conforme o backend do projeto.
 *
 * Nunca versionar secrets; autorização real é sempre do backend
 * (ver `.kiro/steering/frontend-engineering.md` → Security).
 */
export function createLocalTokenStorage(): TokenStorage {
  return {
    read(): SessionTokens | null {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as SessionTokens;
        return typeof parsed?.accessToken === 'string' ? parsed : null;
      } catch {
        return null;
      }
    },
    write(tokens: SessionTokens): void {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
    },
    clear(): void {
      localStorage.removeItem(STORAGE_KEY);
    },
  };
}

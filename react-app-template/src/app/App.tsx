import { TokensReferencePage } from '@/shared/design-system/reference/TokensReferencePage';

/**
 * Componente raiz da aplicação.
 *
 * Nesta fase (spec 002) exibe a página de referência dos tokens do Design
 * System, que valida a linguagem visual e o tema. Roteamento e shell entram
 * nas specs 005+.
 */
export function App() {
  return <TokensReferencePage />;
}

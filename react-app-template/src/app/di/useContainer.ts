import { useContext } from 'react';

import type { Container } from './container';
import { ContainerContext } from './container-context';

/** Acessa o container de dependências. Requer o `ContainerProvider`. */
export function useContainer(): Container {
  const container = useContext(ContainerContext);
  if (container === null) {
    throw new Error('useContainer deve ser usado dentro de um ContainerProvider.');
  }
  return container;
}

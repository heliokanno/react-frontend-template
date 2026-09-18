import { useState, type ReactNode } from 'react';

import { createContainer } from './container';
import { ContainerContext } from './container-context';

type ContainerProviderProps = {
  readonly children: ReactNode;
};

/** Disponibiliza o container de dependências à árvore de componentes. */
export function ContainerProvider({ children }: ContainerProviderProps) {
  const [container] = useState(createContainer);
  return <ContainerContext value={container}>{children}</ContainerContext>;
}

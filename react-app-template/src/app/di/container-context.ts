import { createContext } from 'react';

import type { Container } from './container';

export const ContainerContext = createContext<Container | null>(null);

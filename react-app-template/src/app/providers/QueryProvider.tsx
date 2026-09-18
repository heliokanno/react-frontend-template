import { QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

import { createQueryClient } from '@/infrastructure/query/queryClient';

type QueryProviderProps = {
  readonly children: ReactNode;
};

/** Disponibiliza o QueryClient para a árvore. Um cliente por sessão de app. */
export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(createQueryClient);
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

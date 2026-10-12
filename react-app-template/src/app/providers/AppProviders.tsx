import { type ReactNode } from 'react';

import { ContainerProvider } from '@/app/di/ContainerProvider';
import { PermissionBridge } from '@/app/providers/PermissionBridge';
import { QueryProvider } from '@/app/providers/QueryProvider';
import { SessionProvider } from '@/app/providers/SessionProvider';
import { ThemeProvider } from '@/shared/design-system/theme/ThemeProvider';
import { ToastProvider } from '@/shared/ui/toast/ToastProvider';
import { TooltipProvider } from '@/shared/ui/tooltip/Tooltip';

type AppProvidersProps = {
  readonly children: ReactNode;
};

/**
 * Compõe todos os providers globais em ordem previsível. Sem regra de negócio
 * (ver `.kiro/steering/frontend-architecture.md` → App Layer).
 *
 * Ordem: DI → Query → Session (auth) → Permission → Theme → Tooltip → Toast.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ContainerProvider>
      <QueryProvider>
        <SessionProvider>
          <PermissionBridge>
            <ThemeProvider>
              <TooltipProvider>
                <ToastProvider>{children}</ToastProvider>
              </TooltipProvider>
            </ThemeProvider>
          </PermissionBridge>
        </SessionProvider>
      </QueryProvider>
    </ContainerProvider>
  );
}

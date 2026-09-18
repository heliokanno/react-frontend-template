import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '@/app/App';
import { QueryProvider } from '@/app/providers/QueryProvider';
import { ThemeProvider } from '@/shared/design-system/theme/ThemeProvider';
import { ToastProvider } from '@/shared/ui/toast/ToastProvider';
import { TooltipProvider } from '@/shared/ui/tooltip/Tooltip';

import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Elemento raiz #root não encontrado no documento.');
}

createRoot(rootElement).render(
  <StrictMode>
    <QueryProvider>
      <ThemeProvider>
        <TooltipProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryProvider>
  </StrictMode>,
);

import { useContext } from 'react';

import { ThemeContext, type ThemeContextValue } from './theme-context';

/**
 * Acessa o tema atual e o controle de preferência.
 * Deve ser usado dentro de um `ThemeProvider`.
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider.');
  }
  return context;
}

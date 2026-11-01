import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

import {
  THEME_STORAGE_KEY,
  ThemeContext,
  type ResolvedTheme,
  type ThemeContextValue,
  type ThemePreference,
} from './theme-context';

function readStoredPreference(): ThemePreference {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored;
  }
  return 'system';
}

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

type ThemeProviderProps = {
  readonly children: ReactNode;
};

/**
 * Provê o tema para a aplicação. Componentes não leem o tema para estilizar —
 * consomem tokens semânticos. Este contexto existe apenas para o controle
 * (toggle) e para reagir à preferência do sistema.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [preference, setPreferenceState] = useState<ThemePreference>(readStoredPreference);
  // O tema do SO é um sistema externo: mantemos como estado e o sincronizamos.
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme);

  // Tema resolvido é DERIVADO (não armazenado como estado).
  const resolvedTheme: ResolvedTheme = preference === 'system' ? systemTheme : preference;

  const setPreference = useCallback((next: ThemePreference) => {
    localStorage.setItem(THEME_STORAGE_KEY, next);
    setPreferenceState(next);
  }, []);

  // Sincroniza a classe `.dark` do documento com o tema resolvido (sistema externo).
  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
  }, [resolvedTheme]);

  // Assina mudanças da preferência do SO (sistema externo).
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => setSystemTheme(media.matches ? 'dark' : 'light');
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ preference, resolvedTheme, setPreference }),
    [preference, resolvedTheme, setPreference],
  );

  return <ThemeContext value={value}>{children}</ThemeContext>;
}

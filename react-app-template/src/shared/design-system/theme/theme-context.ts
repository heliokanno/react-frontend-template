import { createContext } from 'react';

/** Preferência de tema escolhida pelo usuário. `system` segue o SO. */
export type ThemePreference = 'light' | 'dark' | 'system';

/** Tema efetivamente aplicado (resolvido a partir da preferência). */
export type ResolvedTheme = 'light' | 'dark';

export type ThemeContextValue = {
  /** Preferência atual (light/dark/system). */
  readonly preference: ThemePreference;
  /** Tema resolvido e aplicado no documento. */
  readonly resolvedTheme: ResolvedTheme;
  /** Define uma nova preferência de tema. */
  readonly setPreference: (preference: ThemePreference) => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Chave usada para persistir a preferência de tema. */
export const THEME_STORAGE_KEY = 'theme-preference';

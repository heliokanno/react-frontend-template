/**
 * Entry point público: tema do Design System (`@hmk/react-admin-kit/design-system`).
 *
 * Os tokens CSS e o preset Tailwind são distribuídos como artefatos de estilo
 * (`./tokens.css`, `./styles.css`, preset), não por este módulo JS.
 */
export { ThemeProvider } from '@/shared/design-system/theme/ThemeProvider';
export { useTheme } from '@/shared/design-system/theme/useTheme';
export { ThemeToggle } from '@/shared/design-system/theme/ThemeToggle';
export {
  THEME_STORAGE_KEY,
  type ThemePreference,
  type ResolvedTheme,
  type ThemeContextValue,
} from '@/shared/design-system/theme/theme-context';

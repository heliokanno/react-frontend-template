import { Monitor, Moon, Sun } from 'lucide-react';

import type { ThemePreference } from './theme-context';
import { useTheme } from './useTheme';

import { cn } from '@/shared/ui/cn';

const OPTIONS: ReadonlyArray<{
  readonly value: ThemePreference;
  readonly label: string;
  readonly Icon: typeof Sun;
}> = [
  { value: 'light', label: 'Tema claro', Icon: Sun },
  { value: 'dark', label: 'Tema escuro', Icon: Moon },
  { value: 'system', label: 'Tema do sistema', Icon: Monitor },
];

/**
 * Alterna a preferência de tema. Usa um grupo de botões com rótulo acessível;
 * o ícone é decorativo (oculto de leitores de tela), o texto acessível vem do
 * rótulo do botão.
 */
export function ThemeToggle() {
  const { preference, setPreference } = useTheme();

  return (
    <div
      role="group"
      aria-label="Preferência de tema"
      className="border-border-default inline-flex gap-1 rounded-md border p-1"
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const isSelected = preference === value;
        return (
          <button
            key={value}
            type="button"
            aria-label={label}
            aria-pressed={isSelected}
            onClick={() => setPreference(value)}
            className={cn(
              'inline-flex h-9 w-9 items-center justify-center rounded-sm',
              'text-text-secondary transition-colors',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)]',
              isSelected
                ? 'bg-action-primary text-text-on-accent'
                : 'hover:bg-surface-subtle hover:text-text-primary',
            )}
          >
            <Icon aria-hidden="true" size={18} />
          </button>
        );
      })}
    </div>
  );
}

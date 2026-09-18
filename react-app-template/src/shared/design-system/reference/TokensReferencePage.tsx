import { ComponentsShowcase } from './ComponentsShowcase';

import { ThemeToggle } from '@/shared/design-system/theme/ThemeToggle';

type Swatch = { readonly name: string; readonly variable: string };

const SURFACE_SWATCHES: readonly Swatch[] = [
  { name: 'surface.default', variable: '--color-surface-default' },
  { name: 'surface.subtle', variable: '--color-surface-subtle' },
  { name: 'surface.elevated', variable: '--color-surface-elevated' },
  { name: 'surface.inverse', variable: '--color-surface-inverse' },
];

const TEXT_SWATCHES: readonly Swatch[] = [
  { name: 'text.primary', variable: '--color-text-primary' },
  { name: 'text.secondary', variable: '--color-text-secondary' },
  { name: 'text.muted', variable: '--color-text-muted' },
];

const ACTION_SWATCHES: readonly Swatch[] = [
  { name: 'action.primary', variable: '--color-action-primary' },
  { name: 'action.primary.hover', variable: '--color-action-primary-hover' },
  { name: 'action.primary.active', variable: '--color-action-primary-active' },
];

const FEEDBACK_SWATCHES: readonly Swatch[] = [
  { name: 'feedback.success', variable: '--color-feedback-success' },
  { name: 'feedback.warning', variable: '--color-feedback-warning' },
  { name: 'feedback.error', variable: '--color-feedback-error' },
  { name: 'feedback.info', variable: '--color-feedback-info' },
];

function ColorGrid({ title, swatches }: { title: string; swatches: readonly Swatch[] }) {
  return (
    <section aria-labelledby={`color-${title}`} className="flex flex-col gap-3">
      <h3 id={`color-${title}`} className="text-text-secondary text-sm font-medium">
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {swatches.map((swatch) => (
          <div key={swatch.name} className="flex flex-col gap-2">
            <div
              className="border-border-default h-16 w-full rounded-md border"
              style={{ backgroundColor: `var(${swatch.variable})` }}
            />
            <code className="text-text-muted text-xs">{swatch.name}</code>
          </div>
        ))}
      </div>
    </section>
  );
}

const SPACING_STEPS = ['--space-2', '--space-4', '--space-6', '--space-8', '--space-12'] as const;
const RADIUS_STEPS = ['--radius-sm', '--radius-md', '--radius-lg', '--radius-xl'] as const;
const SHADOW_STEPS = ['--shadow-sm', '--shadow-md', '--shadow-lg'] as const;

/**
 * Página de referência visual dos tokens do Design System.
 * Serve como documentação viva e como validação do tema (claro/escuro).
 */
export function TokensReferencePage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-12 p-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-text-primary text-3xl font-bold">Design System — Tokens</h1>
          <p className="text-text-secondary">
            Referência visual dos tokens semânticos. Alterne o tema para validar os valores.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <section aria-labelledby="colors-title" className="flex flex-col gap-6">
        <h2 id="colors-title" className="text-text-primary text-xl font-semibold">
          Cores
        </h2>
        <ColorGrid title="Superfícies" swatches={SURFACE_SWATCHES} />
        <ColorGrid title="Texto" swatches={TEXT_SWATCHES} />
        <ColorGrid title="Ação" swatches={ACTION_SWATCHES} />
        <ColorGrid title="Feedback" swatches={FEEDBACK_SWATCHES} />
      </section>

      <section aria-labelledby="type-title" className="flex flex-col gap-4">
        <h2 id="type-title" className="text-text-primary text-xl font-semibold">
          Tipografia
        </h2>
        <p className="text-text-primary text-3xl font-bold">Page title — 3xl bold</p>
        <p className="text-text-primary text-xl font-semibold">Section title — xl semibold</p>
        <p className="text-text-primary text-lg font-medium">Subtitle — lg medium</p>
        <p className="text-text-primary text-base">Body — base normal</p>
        <p className="text-text-secondary text-sm">Body small — sm secondary</p>
        <p className="text-text-muted text-xs">Caption — xs muted</p>
      </section>

      <section aria-labelledby="spacing-title" className="flex flex-col gap-4">
        <h2 id="spacing-title" className="text-text-primary text-xl font-semibold">
          Espaçamento
        </h2>
        <div className="flex flex-col gap-2">
          {SPACING_STEPS.map((token) => (
            <div key={token} className="flex items-center gap-3">
              <div
                className="bg-action-primary h-4 rounded-sm"
                style={{ width: `var(${token})` }}
              />
              <code className="text-text-muted text-xs">{token}</code>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="radius-title" className="flex flex-col gap-4">
        <h2 id="radius-title" className="text-text-primary text-xl font-semibold">
          Radius
        </h2>
        <div className="flex flex-wrap gap-4">
          {RADIUS_STEPS.map((token) => (
            <div key={token} className="flex flex-col items-center gap-2">
              <div
                className="border-border-default bg-surface-subtle h-16 w-16 border"
                style={{ borderRadius: `var(${token})` }}
              />
              <code className="text-text-muted text-xs">{token}</code>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="shadow-title" className="flex flex-col gap-4">
        <h2 id="shadow-title" className="text-text-primary text-xl font-semibold">
          Sombras
        </h2>
        <div className="flex flex-wrap gap-6">
          {SHADOW_STEPS.map((token) => (
            <div key={token} className="flex flex-col items-center gap-2">
              <div
                className="bg-surface-elevated h-16 w-24 rounded-md"
                style={{ boxShadow: `var(${token})` }}
              />
              <code className="text-text-muted text-xs">{token}</code>
            </div>
          ))}
        </div>
      </section>

      <ComponentsShowcase />
    </div>
  );
}

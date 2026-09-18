import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { App } from '@/app/App';
import { ThemeProvider } from '@/shared/design-system/theme/ThemeProvider';

describe('App', () => {
  it('renderiza a página de referência do Design System', () => {
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: /design system — tokens/i }),
    ).toBeInTheDocument();
  });
});

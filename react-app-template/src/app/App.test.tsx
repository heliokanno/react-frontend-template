import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { App } from '@/app/App';

describe('App', () => {
  it('renderiza a rota inicial (referência de tokens)', async () => {
    render(<App />);

    // A página inicial é lazy; aguardamos o heading aparecer.
    expect(
      await screen.findByRole('heading', { level: 1, name: /design system — tokens/i }),
    ).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { App } from '@/app/App';

describe('App', () => {
  it('renderiza o título principal', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /react frontend template/i })).toBeInTheDocument();
  });
});

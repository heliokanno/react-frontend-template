import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Alert } from './Alert';

describe('Alert', () => {
  it('expõe role alert com título e conteúdo', () => {
    render(
      <Alert variant="error" title="Falha ao salvar">
        Verifique os dados e tente novamente.
      </Alert>,
    );

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(/falha ao salvar/i);
    expect(alert).toHaveTextContent(/verifique os dados/i);
  });
});

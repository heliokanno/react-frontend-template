import { describe, expect, it } from 'vitest';

// Teste de fumaça: valida que o runner (Vitest) está operacional.
describe('toolchain de testes', () => {
  it('executa o runner corretamente', () => {
    expect(1 + 1).toBe(2);
  });
});

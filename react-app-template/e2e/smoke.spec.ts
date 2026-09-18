import { expect, test } from '@playwright/test';

// Fluxo de fumaça: garante que a aplicação sobe e renderiza a página de referência.
test('a aplicação carrega e exibe a referência de tokens', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { level: 1, name: /design system — tokens/i }),
  ).toBeVisible();
});

test('permite alternar para o tema escuro', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Tema escuro' }).click();

  await expect(page.locator('html')).toHaveClass(/dark/);
});

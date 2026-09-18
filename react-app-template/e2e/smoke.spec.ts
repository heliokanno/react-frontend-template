import { expect, test } from '@playwright/test';

// Fluxo de fumaça: garante que a aplicação sobe e renderiza o conteúdo base.
test('a aplicação carrega e exibe o título', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: /react frontend template/i })).toBeVisible();
});

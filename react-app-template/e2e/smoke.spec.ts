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

test('abre o dialog e o fecha com Escape', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: /abrir dialog/i }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText(/confirmar exclusão/i);

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('abre o dropdown de ações e navega por teclado', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Ações' }).click();
  await expect(page.getByRole('menuitem', { name: /editar/i })).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(page.getByRole('menuitem', { name: /editar/i })).toBeHidden();
});

test('exibe um toast ao acionar', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: /exibir toast/i }).click();
  const notifications = page.getByRole('region', { name: 'Notificações' });
  await expect(notifications).toContainText(/alterações salvas/i);
});

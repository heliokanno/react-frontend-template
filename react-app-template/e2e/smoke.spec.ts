import { expect, test } from '@playwright/test';

// A rota raiz exibe a página de referência do Design System.
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

test('redireciona rota protegida para o login', async ({ page }) => {
  await page.goto('/dashboard');

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('heading', { level: 1, name: /entrar/i })).toBeVisible();
});

test('exibe a página 404 para rota inexistente', async ({ page }) => {
  await page.goto('/rota-inexistente');

  await expect(
    page.getByRole('heading', { level: 1, name: /página não encontrada/i }),
  ).toBeVisible();
});

test('data grid: busca, pagina e reflete o estado na URL', async ({ page }) => {
  await page.goto('/examples/data-grid');

  await expect(page.getByText(/exibindo 1–10 de 42/i)).toBeVisible();

  // Paginação reflete na URL.
  await page.getByRole('button', { name: /próxima página/i }).click();
  await expect(page).toHaveURL(/page=2/);
  await expect(page.getByText(/exibindo 11–20 de 42/i)).toBeVisible();

  // Busca reflete na URL e filtra.
  await page.getByRole('searchbox').fill('Usuário 42');
  await expect(page).toHaveURL(/search=/);
  await expect(page.getByRole('cell', { name: 'Usuário 42' })).toBeVisible();
});

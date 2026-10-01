import { test, expect } from '@playwright/test';

test.describe('Автентифікація та Маршрутизація', () => {
  test('Спроба відкрити захищений маршрут без входу -> редирект', async ({ page }) => {
    await page.goto('/fields');
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('Реєстрація та вхід', async ({ page }) => {
    await page.goto('/register');
    
    // Реєстрація
    await page.fill('input[name="fullName"]', 'Тест Тестович');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="passwordConfirm"]', 'password123');
    await page.click('button[type="submit"]');

    // Після реєстрації маємо потрапити на дашборд
    await expect(page).toHaveURL(/.*\/dashboard/);
    await expect(page.locator('h1')).toContainText('Дашборд');

    // Вихід
    await page.click('text=Вийти');
    await expect(page).toHaveURL(/.*\/login/);

    // Вхід
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*\/dashboard/);
  });
});

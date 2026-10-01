import { test, expect } from '@playwright/test';

test.describe('Генерація скріншотів', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('Створити скріншоти для документації', async ({ page }) => {
    // 01_login
    await page.goto('/login');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'docs/screenshots/01_login.png' });

    // 02_register_validation
    await page.goto('/register');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'docs/screenshots/02_register_validation.png' });

    // Login for next steps
    await page.goto('/register');
    await page.fill('input[name="fullName"]', 'Агроном Іван');
    await page.fill('input[name="email"]', 'agronom@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="passwordConfirm"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*\/dashboard/);

    // 03_dashboard
    await page.screenshot({ path: 'docs/screenshots/03_dashboard.png' });

    // 04_fields_add
    await page.goto('/fields');
    await page.click('text=Додати поле');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'docs/screenshots/04_fields_add.png' });

    // Add field
    await page.fill('input[name="name"]', 'Поле Північне 1');
    await page.selectOption('select[name="crop"]', 'пшениця');
    await page.fill('input[name="areaHa"]', '120.5');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500);

    // 05_fields_list
    await page.screenshot({ path: 'docs/screenshots/05_fields_list.png' });

    // 06_diagnosis_upload
    await page.goto('/diagnosis');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'docs/screenshots/06_diagnosis_upload.png' });

    // 09_journal
    await page.goto('/journal');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'docs/screenshots/09_journal.png' });
  });
  
  test('Мобільні скріншоти', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    
    // Login
    await page.goto('/register');
    const randomEmail = `agronom_${Date.now()}@example.com`;
    await page.fill('input[name="fullName"]', 'Агроном Іван');
    await page.fill('input[name="email"]', randomEmail);
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="passwordConfirm"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*\/dashboard/);

    // 10_mobile_dashboard
    await page.screenshot({ path: 'docs/screenshots/10_mobile_dashboard.png' });

    // 11_mobile_menu
    await page.click('button:has(svg)'); // Click burger menu
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'docs/screenshots/11_mobile_menu.png' });
  });
});

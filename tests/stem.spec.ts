import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const photo = "public/reference/brown-rust.jpg";

test("підказка після вибору фото, пропорції та експорт", async ({ page }) => {
  await page.setViewportSize({ width: 760, height: 900 });
  await page.goto("/analyze");
  const upload = page.locator(".upload-target");
  const tip = page.getByRole("tooltip");
  await upload.hover();
  await expect(tip).toHaveCSS("opacity", "1");
  await expect(tip).toContainText("10 МБ");
  await page.getByLabel("Обрати фото").setInputFiles(photo);
  await expect(page.getByRole("button", { name: "Здійснити аналіз", exact: true })).toBeEnabled();
  await expect(tip).toHaveCSS("opacity", "0");
  await page.mouse.move(0, 0);
  await upload.hover();
  await expect(tip).toHaveCSS("opacity", "1");
  await expect(tip).toHaveText("Замінити фото");
  await page.getByRole("button", { name: "Здійснити аналіз", exact: true }).click();
  const image = page.locator(".analytics-photo img");
  await expect(image).toBeVisible();
  for (const width of [1280, 760, 375]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(() => image.evaluate((img: HTMLImageElement) => {
      const rect = img.getBoundingClientRect();
      return Math.abs(rect.width / rect.height - img.naturalWidth / img.naturalHeight);
    })).toBeLessThan(0.02);
  }
  await page.evaluate(() => { window.print = () => document.body.setAttribute("data-print-called", "true"); });
  await page.getByRole("button", { name: "Експортувати звіт" }).click();
  await expect(page.locator("body")).toHaveAttribute("data-print-called", "true");
  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".export-report")).toBeHidden();
  await expect(page.locator(".analytics-note")).toBeVisible();
  await expect(page.locator(".mobile-header")).toBeHidden();
});

test("вхід, реєстрація, валідація та вихід", async ({ page }) => {
  await page.goto("/login");
  await expect(page.locator("aside")).toHaveCount(0);
  await page.getByRole("button", { name: "Створити обліковий запис" }).click();
  await page.getByLabel("Логін", { exact: true }).fill("student");
  await page.getByLabel("Пароль", { exact: true }).fill("password123");
  await page.getByLabel("Повторіть пароль").fill("different123");
  await page
    .getByRole("button", { name: "Зареєструватися", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText("не збігаються");
  await page.getByLabel("Повторіть пароль").fill("password123");
  await page
    .getByRole("button", { name: "Зареєструватися", exact: true })
    .click();
  await expect(page).toHaveURL(/\/analyze$/);
  const menuButton = page.getByRole("button", { name: "Меню", exact: true });
  if ((page.viewportSize()?.width ?? 1280) <= 600) {
    await menuButton.click();
    await expect(page.locator("#mobile-menu")).toBeVisible();
  }
  await page.getByRole("button", { name: "Історія", exact: true }).click();
  await expect(page).toHaveURL(/\/analyze$/);
  await page.getByRole("button", { name: "Акаунт", exact: true }).click();
  await page.getByRole("button", { name: "Вийти", exact: true }).click();
  await expect(page).toHaveURL(/\/login$/);
});

test("фото, скасування, дашборд, стаття та новий аналіз", async ({ page }) => {
  await page.goto("/analyze");
  await page.getByLabel("Обрати фото").setInputFiles(photo);
  await page
    .getByRole("button", { name: "Здійснити аналіз", exact: true })
    .click();
  await page.getByRole("button", { name: "Скасувати", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Результат аналізу" }),
  ).toHaveCount(0);
  await page
    .getByRole("button", { name: "Здійснити аналіз", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Результат аналізу" }),
  ).toBeVisible();
  await expect(page.locator(".prediction-bar>span")).toHaveCount(3);
  await expect(page.locator(".area-ring")).toHaveAttribute("aria-label", /28%/);
  await page.getByRole("link", { name: /Детальніше про хворобу/ }).click();
  await expect(page).toHaveURL(/\/diseases\/brown_rust$/);
  await page
    .getByText("На що звернути увагу під час огляду", { exact: true })
    .click();
  await expect(page.locator("details").first()).toHaveAttribute("open", "");
  const menuButton = page.getByRole("button", { name: "Меню", exact: true });
  if ((page.viewportSize()?.width ?? 1280) <= 600) {
    await menuButton.click();
    await expect(page.locator("#mobile-menu")).toBeVisible();
  }
  await page.getByRole("link", { name: "Аналіз", exact: true }).click();
  await page.getByLabel("Обрати фото").setInputFiles(photo);
  await page
    .getByRole("button", { name: "Здійснити аналіз", exact: true })
    .click();
  await page.getByRole("button", { name: "Аналізувати інше фото" }).click();
  await expect(
    page.getByRole("button", { name: "Здійснити аналіз", exact: true }),
  ).toBeDisabled();
});

test("невалідні файли та відновлення", async ({ page }) => {
  await page.goto("/analyze");
  for (const [buffer, mimeType, name] of [
    [Buffer.from("bad"), "image/png", "bad.png"],
    [Buffer.alloc(0), "image/png", "empty.png"],
    [Buffer.from("text"), "text/plain", "a.txt"],
  ] as const) {
    await page
      .getByLabel("Обрати фото")
      .setInputFiles({ buffer, mimeType, name });
    await expect(page.getByRole("alert")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Здійснити аналіз", exact: true }),
    ).toBeDisabled();
  }
  await page.getByLabel("Обрати фото").setInputFiles(photo);
  await expect(page.getByRole("alert")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Здійснити аналіз", exact: true }),
  ).toBeEnabled();
});

test("маршрути, адаптивність і автоматична доступність", async ({ page }) => {
  test.setTimeout(90000);
  for (const width of [320, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/login",
      "/analyze",
      "/diseases",
      "/diseases/brown_rust",
    ]) {
      await page.goto(route);
      await expect(page.locator("h1")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      expect(result.violations).toEqual([]);
    }
  }
  await page.goto("/diseases/missing");
  await expect(page.locator("h1")).toHaveText("Хворобу не знайдено");
  await page.goto("/missing");
  await expect(page.locator("h1")).toHaveText("Сторінку не знайдено");
});

test("дашборд на вузькому екрані та доступність", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/analyze");
  await page.getByLabel("Обрати фото").setInputFiles(photo);
  await page
    .getByRole("button", { name: "Здійснити аналіз", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Результат аналізу" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(result.violations).toEqual([]);
});

test("довідник із десятьма хворобами та пошук", async ({ page }) => {
  await page.goto("/diseases");
  await expect(page.locator(".disease-summary")).toHaveCount(10);
  await expect(page.locator(".catalog-count")).toHaveCount(0);
  const search = page.getByRole("searchbox", { name: "Пошук хвороби" });
  await search.fill("  ІРЖА  ");
  await expect(page.locator(".disease-summary")).toHaveCount(3);
  await search.fill("Pyrenophora");
  await expect(page.locator(".disease-name")).toHaveText(["Піренофороз"]);
  await page.locator(".disease-summary a").click();
  await expect(page.locator("h1")).toHaveText("Піренофороз");
  await page.goBack();
  await expect(search).toHaveValue("Pyrenophora");
  await search.fill("немаєтакоїхвороби");
  await expect(page.locator(".catalog-empty")).toHaveText("Хвороб не знайдено");
  await page.getByRole("button", { name: "Очистити пошук" }).click();
  await expect(page.locator(".disease-summary")).toHaveCount(10);
  await expect(page.locator(".catalog-count")).toHaveCount(0);
});

test("ресурси сторінки та політика безпеки без помилок", async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.addInitScript(() => {
    document.addEventListener("securitypolicyviolation", (event) => {
      document.documentElement.dataset.cspViolation = event.violatedDirective;
    });
  });
  await page.goto("/diseases");
  const image = page.locator(".disease-summary img").first();
  await expect(image).toHaveAttribute("loading", "eager");
  await expect
    .poll(() =>
      image.evaluate((node) => (node as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(0);
  expect(
    await image.evaluate((node) => (node as HTMLImageElement).currentSrc),
  ).toContain("/thumbs/");
  await page.goto("/analyze");
  await page.getByLabel("Обрати фото").setInputFiles(photo);
  await page.getByRole("button", { name: "Здійснити аналіз" }).click();
  await expect(
    page.getByRole("heading", { name: "Результат аналізу" }),
  ).toBeVisible();
  expect(
    await page.locator("html").getAttribute("data-csp-violation"),
  ).toBeNull();
  expect(errors).toEqual([]);
  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBeTruthy();
  expect(await robots.text()).toContain("User-agent: *");
  const icon = await request.get("/favicon.svg");
  expect(icon.ok()).toBeTruthy();
  expect(icon.headers()["content-type"]).toContain("image/svg+xml");
});

test("мобільне меню: переходи, закриття та зміна ширини", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/analyze");
  await expect(page.locator(".site-header")).toBeHidden();
  const trigger = page.getByRole("button", { name: "Меню", exact: true });
  const menu = page.locator("#mobile-menu");
  await trigger.click();
  await expect(menu).toBeVisible();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  expect(
    (await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze())
      .violations,
  ).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();
  await menu.getByRole("link", { name: "Довідник", exact: true }).click();
  await expect(page).toHaveURL(/\/diseases$/);
  await expect(menu).toBeHidden();
  await trigger.click();
  await page.getByRole("heading", { name: "Довідник хвороб пшениці" }).click();
  await expect(menu).toBeHidden();
  await trigger.click();
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(menu).toBeHidden();
  await expect(trigger).toBeHidden();
  await expect(page.locator(".site-header")).toBeVisible();
});

import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.goto("/menu");
  await expect(page.locator(".swiper-initialized")).toHaveCount(6);
});

test("each slider's arrows and focused keyboard input move only that category", async ({ page }) => {
  const sliders = page.locator("[data-slider-id]");
  for (let index = 0; index < 6; index++) {
    const slider = sliders.nth(index);
    await slider.getByRole("button", { name: /^Next/ }).click();
    await expect(slider.getByRole("status")).toHaveText(/^02/);
    for (let other = 0; other < 6; other++) {
      if (other !== index) await expect(sliders.nth(other).getByRole("status")).toHaveText(/^01/);
    }
    const track = slider.locator(".swiper");
    await track.focus();
    await track.press("ArrowRight");
    await expect(slider.getByRole("status")).toHaveText(/^03/);
    await track.press("ArrowLeft");
    await slider.getByRole("button", { name: /^Previous/ }).click();
    await expect(slider.getByRole("status")).toHaveText(/^01/);
    await expect(slider.getByRole("button", { name: /^Previous/ })).toBeDisabled();
  }
});

test("touch swipe advances coffee without moving matcha", async ({ page, context }) => {
  const track = page.locator("#coffee-based-track");
  await track.scrollIntoViewIfNeeded();
  const box = (await track.boundingBox())!;
  const session = await context.newCDPSession(page);
  const y = box.y + Math.min(100, box.height / 2);
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: box.x + 270, y }] });
  for (const x of [240, 200, 150, 100, 50]) {
    await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: box.x + x, y }] });
  }
  await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect(page.locator('[data-slider-id="coffee-based"]').getByRole("status")).toHaveText(/^02/);
  await expect(page.locator('[data-slider-id="matcha-series"]').getByRole("status")).toHaveText(/^01/);
  await session.detach();
});

test("desktop collections that fit hide controls and resize restores them", async ({ page }) => {
  const matcha = page.locator('[data-slider-id="matcha-series"]');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(matcha.locator(".slider-controls")).toBeHidden();
  await expect(page.locator('[data-slider-id="milktea-based"] .slider-controls')).toBeHidden();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(matcha.locator(".slider-controls")).toBeVisible();
  await expect(matcha.getByRole("button", { name: /^Next/ })).toBeEnabled();
  for (let count = 0; count < 3; count++) await matcha.getByRole("button", { name: /^Next/ }).click();
  await expect(matcha.getByRole("button", { name: /^Next/ })).toBeDisabled();
});

for (const width of [320, 375, 390, 430, 768, 1440]) {
  test(`menu fits ${width}px and all anchors clear the header`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await expect(page.locator("[data-product-id]")).toHaveCount(37);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    if (width === 390) {
      const media = await page.locator(".product-media").first().boundingBox();
      expect(media!.y).toBeLessThan(600);
    }
    for (const name of ["Drinks", "Snacks", "Weekend Cocktails"]) {
      await page.getByRole("navigation", { name: "Menu sections" }).getByRole("link", { name, exact: true }).click();
      const heading = await page.getByRole("heading", { name: `${name}.`, exact: true }).boundingBox();
      const header = await page.locator(".floating-header").boundingBox();
      expect(heading!.y).toBeGreaterThanOrEqual(header!.y + header!.height);
    }
    expect(await page.locator('[data-product-id="churros"] .product-price').count()).toBe(0);
    await expect(page.locator('[data-product-id="waffles"]')).toContainText("₱20 for additional toppings");
    const longName = page.locator('[data-product-id="blueberry-peach-cocktail"] h4');
    expect(await longName.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  });
}

test("reduced-motion preference and keyboard focus are respected", async ({ page }) => {
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
  const track = page.locator("#coffee-based-track");
  await track.focus();
  expect(await track.evaluate((element) => getComputedStyle(element).outlineStyle)).not.toBe("none");
  await track.press("ArrowRight");
  await expect(page.locator('[data-slider-id="coffee-based"]').getByRole("status")).toHaveText(/^02/);
  expect(await track.locator(".swiper-wrapper").evaluate((element) => getComputedStyle(element).transitionDuration)).toBe("0s");
});

test("menu has no runtime errors or automated accessibility violations", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.reload();
  await expect(page.locator(".swiper-initialized")).toHaveCount(6);
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(results.violations).toEqual([]);
  }
  expect(errors).toEqual([]);
});

test("static menu remains readable and scrollable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("http://localhost:3000/menu");
  await expect(page.locator("[data-product-id]")).toHaveCount(37);
  const track = page.locator("#coffee-based-track");
  expect(await track.evaluate((element) => getComputedStyle(element).overflowX)).toBe("auto");
  await track.evaluate((element) => { element.scrollLeft = element.scrollWidth; });
  expect(await track.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  await context.close();
});

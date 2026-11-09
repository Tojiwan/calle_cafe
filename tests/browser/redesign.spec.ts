import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/menu");
  await expect(page.locator(".swiper-initialized")).toHaveCount(6);
  await page.evaluate(() => document.fonts.ready);
});

test("unified cards separate real variants and keep snack chips informational", async ({ page }) => {
  await expect(page.locator(".product-card--drink")).toHaveCount(26);
  await expect(page.locator(".product-card--snack")).toHaveCount(6);
  const coffee = page.locator('[data-product-id="ISPANIS LATEY"]');
  await expect(coffee.locator(".card-index")).toHaveText("02 / 07");
  await expect(coffee.locator(".price-label")).toHaveText(["Hot · 10 oz", "Iced · 16 oz"]);
  await expect(coffee.locator(".product-price")).toHaveText(["₱115", "₱160"]);
  const affogato = page.locator('[data-product-id="coffee-affogato"]');
  await expect(affogato.locator(".product-price")).toHaveText("₱140");
  await expect(affogato.locator(".price-label")).toHaveCount(0);
  await expect(page.locator('[data-product-id="GREYPS TEA"] .price-label')).toHaveText("Iced");
  await expect(page.locator('[data-product-id="churros"] .card-meta')).toContainText("5 pieces");
  const waffles = page.locator('[data-product-id="waffles"]');
  await expect(waffles.locator(".option-chip")).toHaveText(["Chocolate", "Caramel", "Strawberry", "Matcha", "Almond", "Oreo", "Biscoff", "Choco Chips"]);
  await expect(page.locator(".option-chip:is(button, a, [tabindex], [role=button]), .option-chip :is(button, a, [tabindex])")).toHaveCount(0);
  await expect(page.locator('[data-product-id="nachos"] .product-options')).toHaveCount(0);
  await expect(waffles.locator('.product-surface .product-options')).toHaveCount(0);
  await expect(waffles.locator('.card-back .product-options')).toHaveCount(1);
  expect(await waffles.locator('.product-media').evaluate(el => getComputedStyle(el).aspectRatio)).toBe('4 / 3');
  await expect(page.locator(".product-price")).toHaveCount(42);
  const priceBottoms = await page.locator('#coffee-based .product-card').evaluateAll(cards => cards.map(card => {
    const price = [...card.querySelectorAll('.product-price')].at(-1)!;
    return price.getBoundingClientRect().bottom - card.getBoundingClientRect().top;
  }));
  expect(Math.max(...priceBottoms) - Math.min(...priceBottoms)).toBeLessThanOrEqual(1);
});

test("snack options flip with keyboard and pointer without moving the slider", async ({ page }) => {
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const card = page.locator('[data-product-id="churros"]');
    const toggle = card.locator('summary');
    const counter = page.locator('[data-slider-id="snacks"] [role="status"]');
    const before = await counter.textContent();
    await expect(card.locator('.card-back')).toBeHidden();
    const height = (await card.boundingBox())!.height;
    await toggle.focus();
    await toggle.press('Enter');
    await expect(card.locator('.card-back')).toBeVisible();
    await expect(card.locator('.product-surface')).toBeHidden();
    await expect(toggle).toHaveText(/Back to item/);
    await expect(counter).toHaveText(before!);
    expect(Math.abs((await card.boundingBox())!.height - height)).toBeLessThan(1);
    await toggle.click();
    await expect(card.locator('.card-back')).toBeHidden();
    await expect(card.locator('.product-surface')).toBeVisible();
    await expect(page.locator('[data-product-id="nachos"] summary')).toHaveCount(0);
  }
  const coffee = page.locator('[data-product-id="EYSEL NAT KOPI"]');
  const gap = await coffee.evaluate(card => card.querySelector('.product-prices')!.getBoundingClientRect().top - card.querySelector('h4')!.getBoundingClientRect().bottom);
  expect(gap).toBeLessThanOrEqual(13);
});

test("weekend drinks retain their original card and slider treatment", async ({ page }) => {
  const weekend = page.locator("#weekend-cocktails");
  await expect(weekend.locator(".product-card")).toHaveCount(4);
  await expect(weekend.locator(".card-meta, .product-prices, .slider-progress, .option-chip, .product-card--drink")).toHaveCount(0);
  await expect(weekend.locator(".product-price")).toHaveText(["₱100", "₱100", "₱100", "₱100"]);
  expect(await weekend.locator(".product-media").first().evaluate(el => getComputedStyle(el).aspectRatio)).toBe("4 / 5");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(weekend.getByRole("status")).toHaveText("01–04 / 04");
  await expect(weekend.locator(".slider-controls")).toBeHidden();
});

test("progress fills from the left through the last visible card and reaches full at the end", async ({ page }) => {
  const coffee = page.locator('[data-slider-id="coffee-based"]');
  const fill = coffee.locator(".slider-progress-fill");
  const matcha = page.locator('[data-slider-id="matcha-series"]');
  for (const width of [390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.reload();
    await expect(fill).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    const before = await fill.boundingBox();
    const track = await coffee.locator(".slider-progress").boundingBox();
    const visibleCards = width >= 1200 ? 4 : width >= 1024 ? 3 : width >= 768 ? 2 : 1;
    expect(Math.abs(before!.width / track!.width - visibleCards / 7)).toBeLessThan(0.01);
    expect(Math.abs(before!.x - track!.x)).toBeLessThan(1);
    expect(before!.width).toBeGreaterThan(0);
    expect(before!.width).toBeLessThan(track!.width);
    const matchaBefore = await matcha.locator(".slider-progress-fill").getAttribute("style");
    const next = coffee.getByRole("button", { name: /^Next/ });
    await next.click();
    await expect.poll(async () => (await fill.boundingBox())!.width).toBeGreaterThan(before!.width);
    expect(Math.abs((await fill.boundingBox())!.x - track!.x)).toBeLessThan(1);
    await expect(matcha.locator(".slider-progress-fill")).toHaveAttribute("style", matchaBefore!);
    for (let step = 0; step < 7 && await next.isEnabled(); step++) await next.click();
    await expect(next).toBeDisabled();
    const end = await fill.boundingBox();
    const endTrack = await coffee.locator(".slider-progress").boundingBox();
    expect(Math.abs(end!.x + end!.width - endTrack!.x - endTrack!.width)).toBeLessThan(1);
    expect(Math.abs(end!.x - endTrack!.x)).toBeLessThan(1);
    expect(Math.abs(end!.width - endTrack!.width)).toBeLessThan(1);
    await expect(coffee.getByRole("status")).toContainText("07 / 07");
    await coffee.getByRole('button', { name: /^Previous/ }).click();
    await expect.poll(async () => (await fill.boundingBox())!.width / (await coffee.locator('.slider-progress').boundingBox())!.width).toBeLessThan(0.99);
    await next.click();
  }
  const matchaTrack = await matcha.locator(".slider-progress").boundingBox();
  const matchaFill = await matcha.locator(".slider-progress-fill").boundingBox();
  expect(Math.abs(matchaTrack!.width - matchaFill!.width)).toBeLessThan(1);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(coffee.getByRole("status")).toHaveText("07 / 07");
  await expect(matcha.getByRole("status")).toHaveText("01 / 04");
  expect((await matcha.locator(".slider-progress-fill").boundingBox())!.width).toBeLessThan((await matcha.locator(".slider-progress").boundingBox())!.width);
});

test("normal-motion pointer dragging updates progress and keeps other categories still", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  const coffee = page.locator('[data-slider-id="coffee-based"]');
  const viewport = coffee.locator('.swiper');
  await viewport.scrollIntoViewIfNeeded();
  const bounds = (await viewport.boundingBox())!;
  const fill = coffee.locator('.slider-progress-fill');
  const initial = (await fill.boundingBox())!.width;
  await page.mouse.move(bounds.x + bounds.width * 0.75, bounds.y + 100);
  await page.mouse.down();
  await page.mouse.move(bounds.x + bounds.width * 0.35, bounds.y + 100, { steps: 16 });
  await page.mouse.up();
  await expect(coffee.getByRole('status')).not.toHaveText('01–04 / 07');
  await expect.poll(async () => (await fill.boundingBox())!.width).toBeGreaterThan(initial);
  await expect(page.locator('[data-slider-id="matcha-series"]').getByRole('status')).toHaveText('01–04 / 04');
  await expect.poll(() => viewport.evaluate(el => (el as HTMLElement & { swiper: { animating: boolean } }).swiper.animating)).toBe(false);
  const afterDrag = await coffee.getByRole('status').textContent();
  await viewport.focus();
  await viewport.press('ArrowRight');
  await expect(coffee.getByRole('status')).not.toHaveText(afterDrag!);
  for (let step = 0; step < 3 && await coffee.getByRole('button', { name: /^Next/ }).isEnabled(); step++) {
    await expect.poll(() => viewport.evaluate(el => (el as HTMLElement & { swiper: { animating: boolean } }).swiper.animating)).toBe(false);
    await coffee.getByRole('button', { name: /^Next/ }).click();
  }
  await expect(coffee.getByRole('status')).toHaveText('04–07 / 07');
  await expect(coffee.getByRole('button', { name: /^Next/ })).toBeDisabled();
});

test("redesigned cards fit all widths and snack cards keep natural heights without clipping options", async ({ page }) => {
  for (const width of [320, 375, 390, 430, 768, 1024, 1200, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(page.locator('.product-card--snack')).toHaveCount(6);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.locator('.product-card--drink, .product-card--snack').evaluateAll(cards => cards.every(card => card.scrollWidth <= card.clientWidth))).toBe(true);
    const waffles = await page.locator('[data-product-id="waffles"]').boundingBox();
    const nachos = await page.locator('[data-product-id="nachos"]').boundingBox();
    expect(waffles!.height).toBeGreaterThan(nachos!.height + 40);
    expect(await page.locator('#snacks .product-card').evaluateAll(cards => cards.every(card => card.scrollHeight <= card.clientHeight))).toBe(true);
    const media = await page.locator('#coffee-based-track .product-media').first().boundingBox();
    const nextMedia = await page.locator('#coffee-based-track .product-media').nth(1).boundingBox();
    expect(Math.abs(media!.y - nextMedia!.y)).toBeLessThan(1);
  }
});

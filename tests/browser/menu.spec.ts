import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.goto("/menu");
  await expect(page.locator(".swiper-initialized")).toHaveCount(6);
});

test("selected navigation follows scrolling in both directions, independent of the hash", async ({ page }) => {
  const nav = page.getByRole('navigation', { name: 'Menu sections' });
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    await nav.getByRole('link', { name: 'Weekend Cocktails' }).click();
    await expect(nav.locator('[aria-current="location"]')).toHaveAttribute('href', '#weekend-cocktails');
    for (const id of ['snacks', 'drinks', 'snacks', 'weekend-cocktails']) {
      await page.locator(`section#${id}`).evaluate((section) => section.scrollIntoView());
      await expect(nav.locator('[aria-current="location"]')).toHaveAttribute('href', `#${id}`);
      expect(new URL(page.url()).hash).toBe('#weekend-cocktails');
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(nav.locator('[aria-current="location"]')).toHaveAttribute('href', '#drinks');
  }
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
  const initialProgress = await page.locator('#coffee-based .slider-progress-fill').getAttribute('style');
  const session = await context.newCDPSession(page);
  const y = box.y + Math.min(100, box.height / 2);
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: box.x + 270, y }] });
  for (const x of [240, 200, 150, 100, 50]) {
    await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: box.x + x, y }] });
  }
  await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect(page.locator('[data-slider-id="coffee-based"]').getByRole("status")).toHaveText(/^02/);
  await expect(page.locator('[data-slider-id="matcha-series"]').getByRole("status")).toHaveText(/^01/);
  await expect(page.locator('#coffee-based .slider-progress-fill')).not.toHaveAttribute('style', initialProgress!);
  await session.detach();
});

test("slider counters reflect full cards at the start, end, and after resizing", async ({ page }) => {
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.reload();
    await expect(page.locator('.swiper-initialized')).toHaveCount(6);
    for (const [id, total] of [["coffee-based", 7], ["fruit-series", 11]] as const) {
      const slider = page.locator(`[data-slider-id="${id}"]`);
      const status = slider.getByRole('status');
      const fullCards = width === 1440 ? 4 : width === 768 ? 2 : 1;
      const pad = (value: number) => String(value).padStart(2, '0');
      await expect(status).toHaveText(`${fullCards === 1 ? '01' : `01–${pad(fullCards)}`} / ${pad(total)}`);
      const next = slider.getByRole('button', { name: /^Next/ });
      for (let step = 0; step < total && await next.isEnabled(); step++) await next.click();
      await expect(next).toBeDisabled();
      await expect(status).toHaveText(`${fullCards === 1 ? pad(total) : `${pad(total - fullCards + 1)}–${pad(total)}`} / ${pad(total)}`);
    }
  }
  const matcha = page.locator('[data-slider-id="matcha-series"]');
  await expect(matcha.getByRole('status')).toHaveText('01–04 / 04');
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(matcha.getByRole('status')).toHaveText('01 / 04');
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
    await expect(page.locator("[data-product-id]")).toHaveCount(36);
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
    await expect(page.locator('[data-product-id="churros"] .product-price')).toHaveText("₱100");
    await expect(page.locator('[data-product-id="waffles"]')).not.toContainText("₱20 for additional toppings");
    await expect(page.locator('[data-product-id="waffles"]')).toContainText("Biscoff");
    const longName = page.locator('[data-product-id="blueberry-peach-cocktail"] h4');
    expect(await longName.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  });
}

test("snack captions show approved prices, quantities, and readable options", async ({ page }) => {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const snacks = page.locator('#snacks .product-card');
    await expect(snacks.locator('.product-price')).toHaveText(["₱100", "₱135", "₱140", "₱185", "₱105", "₱165"]);
    await expect(snacks.locator('.product-quantity')).toHaveText(["5 pieces", "3 pieces"]);
    await expect(snacks.locator('.product-options dt')).toHaveText(["Dip options", "Flavor options", "Syrup options", "Toppings"]);
    const captionsFit = await snacks.locator('.product-caption').evaluateAll((captions) => captions.every((caption) => {
      const name = caption.querySelector('h4')!.getBoundingClientRect();
      const price = caption.querySelector('.product-price')!.getBoundingClientRect();
      return price.left >= name.right && Math.abs(price.top - name.top) < 10 && caption.scrollWidth <= caption.clientWidth;
    }));
    expect(captionsFit).toBe(true);
    await expect(page.locator('.product-price')).toHaveCount(42);
  }
});

test("welcome note stays stacked, visible, and inline at every width", async ({ page }) => {
  for (const width of [320, 375, 390, 430, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    await expect(page.locator(".welcome-note")).toBeVisible();
    const layout = await page.evaluate(() => {
      const heading = document.querySelector(".welcome h1")!.getBoundingClientRect();
      const noteElement = document.querySelector(".welcome-note")!;
      const note = noteElement.getBoundingClientRect();
      const mark = document.querySelector(".welcome-mark")!.getBoundingClientRect();
      return {
        stacked: note.top >= heading.bottom,
        aligned: Math.abs(note.left - heading.left),
        noteHeight: note.height,
        fontSize: parseFloat(getComputedStyle(noteElement).fontSize),
        markWidth: mark.width,
        markHeight: mark.height,
        markNotOrphaned: mark.top < note.top + note.height * 0.7,
      };
    });
    expect(layout.stacked).toBe(true);
    expect(layout.aligned).toBeLessThanOrEqual(1);
    expect(layout.noteHeight).toBeLessThan(width === 320 ? 50 : 30);
    expect(layout.fontSize).toBeGreaterThanOrEqual(14);
    expect(layout.fontSize).toBeLessThanOrEqual(15);
    expect(layout.markWidth).toBeGreaterThanOrEqual(18);
    expect(layout.markWidth).toBeLessThanOrEqual(20.5);
    expect(layout.markHeight).toBeGreaterThanOrEqual(18);
    expect(layout.markHeight).toBeLessThanOrEqual(20.5);
    expect(layout.markNotOrphaned).toBe(true);
  }
});

test("reduced-motion preference and keyboard focus are respected", async ({ page }) => {
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
  const track = page.locator("#coffee-based-track");
  await track.focus();
  expect(await track.evaluate((element) => getComputedStyle(element).outlineStyle)).not.toBe("none");
  await track.press("ArrowRight");
  await expect(page.locator('[data-slider-id="coffee-based"]').getByRole("status")).toHaveText(/^02/);
  expect(await track.locator(".swiper-wrapper").evaluate((element) => getComputedStyle(element).transitionDuration)).toBe("0s");
});

test("final acceptance: inventory, touch targets, and view-only controls", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator("[data-slider-id]")).toHaveCount(6);
  await expect(page.locator("[data-product-id]")).toHaveCount(36);

  const categoryCounts = await page.locator("[data-slider-id]").evaluateAll((sliders) =>
    sliders.map((slider) => [slider.getAttribute("data-slider-id"), slider.querySelectorAll("[data-product-id]").length]),
  );
  expect(categoryCounts).toEqual([
    ["coffee-based", 7], ["matcha-series", 4], ["fruit-series", 11],
    ["milktea-based", 4], ["snacks", 6], ["weekend-cocktails", 4],
  ]);

  const result = await page.evaluate(() => {
    const forbidden = /\b(cart|checkout|order|buy|login|log in|sign in|account|admin|payment)\b/i;
    const visible = [...document.querySelectorAll("a, button")].filter((element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
    });
    return {
      sectionIds: [...document.querySelectorAll("main > section[id]")].map((section) => section.id),
      forbiddenText: document.body.innerText.match(forbidden)?.[0] ?? null,
      undersizedTargets: visible.filter((element) => {
        const rect = element.getBoundingClientRect();
        return rect.width < 44 || rect.height < 44;
      }).map((element) => element.getAttribute("aria-label") ?? element.textContent?.trim()),
      missingAlt: [...document.images].filter((image) => !image.alt.trim()).map((image) => image.src),
    };
  });

  expect(result.sectionIds).toEqual(["drinks", "snacks", "weekend-cocktails"]);
  expect(result.forbiddenText).toBeNull();
  expect(result.undersizedTargets).toEqual([]);
  expect(result.missingAlt).toEqual([]);
  await expect(page.locator(".product-media img").first()).toHaveAttribute("loading", "eager");
  await expect(page.locator('.product-media img[loading="lazy"]')).toHaveCount(35);
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
  await expect(page.locator("[data-product-id]")).toHaveCount(36);
  await expect(page.locator('.product-price')).toHaveCount(42);
  await expect(page.locator('.option-chip')).toHaveCount(15);
  await expect(page.locator('.slider-progress').first()).toBeHidden();
  const track = page.locator("#coffee-based-track");
  expect(await track.evaluate((element) => getComputedStyle(element).overflowX)).toBe("auto");
  await track.evaluate((element) => { element.scrollLeft = element.scrollWidth; });
  expect(await track.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  await context.close();
});

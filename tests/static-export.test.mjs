import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

for (const route of ["index", "menu"]) {
  test(`static ${route} entry contains the complete readable menu`, async () => {
    const html = await readFile(new URL(`../out/${route}.html`, import.meta.url), "utf8");
    assert.match(html, /<html[^>]*lang="en"/);
    assert.match(html, /<main[\s>]/);
    assert.match(html, /Something good/);
    for (const section of ["drinks", "snacks", "weekend-cocktails"]) {
      assert.match(html, new RegExp(`href="#${section}"`));
      assert.match(html, new RegExp(`id="${section}"`));
    }
    assert.equal((html.match(/data-product-id=/g) || []).length, 36);
    assert.equal((html.match(/data-slider-id=/g) || []).length, 6);
    assert.equal((html.match(/class="product-price"/g) || []).length, 42);
    assert.equal((html.match(/class="option-chip"/g) || []).length, 15);
    assert.equal((html.match(/class="card-meta"/g) || []).length, 32);
    assert.match(html, /Hot · 10 oz/);
    assert.match(html, /Iced · 16 oz/);
    assert.doesNotMatch(html, /₱20 for additional toppings/);
    assert.match(html, /Biscoff/);
    assert.doesNotMatch(html, /Our menu is being prepared/);
  });
}

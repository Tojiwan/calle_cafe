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
    assert.equal((html.match(/data-product-id=/g) || []).length, 37);
    assert.equal((html.match(/data-slider-id=/g) || []).length, 6);
    assert.match(html, /₱20 for additional toppings/);
    assert.doesNotMatch(html, /Our menu is being prepared/);
  });
}

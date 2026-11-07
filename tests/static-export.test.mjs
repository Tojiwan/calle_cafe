import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

for (const route of ["index", "menu"]) {
  test(`static ${route} entry contains the honest menu foundation`, async () => {
    const html = await readFile(new URL(`../out/${route}.html`, import.meta.url), "utf8");
    assert.match(html, /<html[^>]*lang="en"/);
    assert.match(html, /<main[\s>]/);
    assert.match(html, /<h1[^>]*>Calle Café<\/h1>/);
    assert.match(html, /Our menu is being prepared\./);
  });
}

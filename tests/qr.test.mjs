import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";
import jsQR from "jsqr";
import sharp from "sharp";

const menuUrl = "https://calle-cafe.pages.dev/menu";

test("printed QR decodes to the permanent production menu URL", async () => {
  const { data, info } = await sharp(fileURLToPath(new URL("../public/calle-menu-qr.png", import.meta.url)))
    .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const decoded = jsQR(new Uint8ClampedArray(data), info.width, info.height);
  assert.ok(decoded, "QR did not decode");
  assert.equal(decoded.data, menuUrl);
  assert.equal(info.width, 1024);
  assert.equal(info.height, 1024);
});

test("SVG QR is present and vector-based", async () => {
  const svg = await readFile(new URL("../public/calle-menu-qr.svg", import.meta.url), "utf8");
  assert.match(svg, /<svg[\s>]/);
  assert.match(svg, /width="1024"/);
});

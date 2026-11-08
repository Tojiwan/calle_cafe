import assert from "node:assert/strict";
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("../public/", import.meta.url));
const categories = [
  ["Drinks/Coffee Based", "coffee-based"],
  ["Drinks/Matcha Series", "matcha-series"],
  ["Drinks/Fruit Series", "fruit-series"],
  ["Drinks/Milktea Based", "milktea-based"],
  ["Foods-Snacks", "snacks"],
  ["Drinks/Weekend Cocktails", "weekend-cocktails"],
];

let count = 0;
for (const [source, category] of categories) {
  const destination = path.join(root, "images/products", category);
  await mkdir(destination, { recursive: true });
  const slugs = new Set();
  for (const file of (await readdir(path.join(root, source))).filter((file) => file.endsWith(".webp"))) {
    const slug = file.replace(/\s*\(.*\)/, "").replace(/\.webp$/, "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
    assert.ok(slug && !slugs.has(slug), `Duplicate or empty asset slug: ${source}/${file}`);
    slugs.add(slug);
    const input = path.join(root, source, file);
    const metadata = await sharp(input).metadata();
    const output = await sharp(input).rotate()
      .resize({ width: 1200, height: 1500, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 }).toFile(path.join(destination, `${slug}.webp`));
    assert.ok(output.width <= 1200 && output.height <= 1500);
    assert.ok(output.width <= metadata.width && output.height <= metadata.height);
    count++;
  }
}

await mkdir(path.join(root, "images/branding"), { recursive: true });
await sharp(path.join(root, "calle-logo.webp"))
  .resize({ width: 512, withoutEnlargement: true })
  .webp({ quality: 90 }).toFile(path.join(root, "images/branding/calle-logo.webp"));
console.log(`Prepared ${count} product assets and logo; source files preserved, no product upscaling or cropping.`);

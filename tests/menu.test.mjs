import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../src/data/menu.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } });
const { menuCategories } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);

const products = menuCategories.flatMap((category) => category.products);
const find = (category, id) => menuCategories.find((item) => item.id === category).products.find((item) => item.id === id);

test("six populated categories preserve the approved inventory", () => {
  assert.deepEqual(menuCategories.map(({ id, products }) => [id, products.length]), [
    ["coffee-based", 7], ["matcha-series", 4], ["fruit-series", 11],
    ["milktea-based", 4], ["snacks", 6], ["weekend-cocktails", 5],
  ]);
  assert.equal(new Set(products.map(({ id }) => id)).size, 37);
});

test("every product references an existing prepared asset and has accessible text", async () => {
  for (const product of products) {
    assert.ok(product.name.trim());
    assert.ok(product.alt.includes(product.name));
    assert.match(product.image, /^\/images\/products\/[a-z0-9/-]+\.webp$/);
    await access(new URL(`../public${product.image}`, import.meta.url));
  }
});

test("poster prices and cup sizes override conflicting filenames", () => {
  assert.equal(find("coffee-based", "eyselnat-kopi").priceLabel, "Hot (10 oz) ₱120 · Iced (16 oz) ₱150");
  assert.equal(find("fruit-series", "istroberi-soda").priceLabel, "Iced (18 oz) ₱80");
  assert.equal(find("fruit-series", "istroberi-melk").priceLabel, "Iced (16 oz) ₱90");
  assert.equal(find("fruit-series", "bluberi-milk").priceLabel, "Iced (16 oz) ₱90");
  assert.equal(find("matcha-series", "derti-matya").priceLabel, "Iced (18 oz) ₱220");
  assert.equal(find("coffee-based", "coffee-affogato").priceLabel, "₱140");
  assert.equal(find("weekend-cocktails", "weekend-affogato").priceLabel, "₱140");
});

test("unverified prices and sizes stay absent; waffle and fries options are readable text", () => {
  for (const id of ["churros", "hashbrowns", "nachos", "loaded-fries"]) {
    assert.equal(find("snacks", id).priceLabel, undefined);
  }
  assert.equal(find("fruit-series", "greyps-tea").priceLabel, "Iced ₱100");
  assert.equal(find("milktea-based", "kukis-n-krim").priceLabel, "Iced ₱115");
  const waffle = find("snacks", "waffles");
  assert.equal(waffle.priceLabel, "₱105");
  assert.match(waffle.description, /Chocolate, Caramel, Strawberry, Matcha/);
  assert.match(waffle.description, /Almond, Oreo, Biscoff, Choco Chips/);
  assert.match(waffle.description, /₱20 for additional toppings/);
  assert.equal(find("snacks", "fries").priceLabel, "₱135");
  assert.match(find("snacks", "fries").description, /Cheese, Barbeque, Sour Cream/);
});

import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
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
    ["milktea-based", 4], ["snacks", 6], ["weekend-cocktails", 4],
  ]);
  assert.equal(new Set(products.map(({ id }) => id)).size, 36);
});

test("every product references an existing prepared asset and has accessible text", async () => {
  for (const product of products) {
    assert.ok(product.name.trim());
    assert.ok(product.alt.includes(product.name));
    assert.match(product.image, /^\/images\/products\/[a-z-]+\/[a-zA-Z0-9 -]+\.webp$/);
    await access(new URL(`../public${product.image}`, import.meta.url));
    const folder = product.image.slice(0, product.image.lastIndexOf("/") + 1);
    const filenames = await readdir(new URL(`../public${folder}`, import.meta.url));
    assert.ok(filenames.includes(product.image.split("/").at(-1)), `Exact asset casing: ${product.image}`);
  }
});

test("poster prices and cup sizes override conflicting filenames", () => {
  assert.equal(find("coffee-based", "EYSEL NAT KOPI").priceLabel, "Hot (10 oz) ₱120 · Iced (16 oz) ₱150");
  assert.equal(find("fruit-series", "ISTROBERI SODA").priceLabel, "Iced (18 oz) ₱80");
  assert.equal(find("fruit-series", "ISTROBERI MELK").priceLabel, "Iced (16 oz) ₱90");
  assert.equal(find("fruit-series", "BLUBERI MELK").priceLabel, "Iced (16 oz) ₱90");
  assert.equal(find("matcha-series", "DERTI MATYA").priceLabel, "Iced (18 oz) ₱220");
  assert.equal(find("coffee-based", "coffee-affogato").priceLabel, "₱140");
  assert.equal(find("weekend-cocktails", "weekend-affogato"), undefined);
});

test("approved snack prices, quantities and options occupy separate fields", () => {
  const snacks = menuCategories.find(({ id }) => id === "snacks").products;
  assert.deepEqual(snacks.map(({ name, priceLabel, piecesLabel }) => [name, priceLabel, piecesLabel]), [
    ["Tsuros", "₱100", "5 pieces"], ["Fries", "₱135", undefined],
    ["AshBrawn", "₱140", "3 pieces"], ["NaChoz", "₱185", undefined],
    ["Waffles", "₱105", undefined], ["Oberload Fries", "₱165", undefined],
  ]);
  assert.deepEqual(find("snacks", "churros").options, [{ label: "Dip options", values: "Chocolate · Caramel · Strawberry · Matcha" }]);
  const waffle = find("snacks", "waffles");
  assert.deepEqual(waffle.options, [
    { label: "Syrup options", values: "Chocolate · Caramel · Strawberry · Matcha" },
    { label: "Toppings", values: "Almond · Oreo · Biscoff · Choco Chips" },
  ]);
  assert.equal(waffle.description, "₱20 for additional toppings.");
  assert.deepEqual(find("snacks", "fries").options, [{ label: "Flavor options", values: "Cheese · Barbeque · Sour Cream" }]);
});

test("all prices render as prices and unknown serving sizes remain absent", () => {
  for (const category of menuCategories) {
    for (const product of category.products) {
      assert.match(product.priceLabel, /₱\d+/);
      if (category.section !== "snacks") assert.equal(product.piecesLabel, undefined);
    }
  }
  assert.equal(find("fruit-series", "GREYPS TEA").priceLabel, "Iced ₱100");
  assert.equal(find("milktea-based", "KUKIS N KRIM").priceLabel, "Iced ₱115");
});

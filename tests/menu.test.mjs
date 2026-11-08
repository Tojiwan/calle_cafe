import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";
import sharp from "sharp";

const source = await readFile(new URL("../src/data/menu.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } });
const { menuCategories } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);

const products = menuCategories.flatMap((category) => category.products);
const find = (category, id) => menuCategories.find((item) => item.id === category).products.find((item) => item.id === id);
const baseline = JSON.parse(await readFile(new URL("./fixtures/menu-content.json", import.meta.url), "utf8"));

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

test("structured prices and options preserve every current menu value", () => {
  const normalized = menuCategories.flatMap((category) => category.products.map(({ prices, options, ...product }) => ({
    category: category.id,
    ...product,
    priceLabel: prices ? prices.map(({ label, value }) => `${label ? `${label.replace(/ · (\d+ oz)$/, " ($1)")} ` : ""}${value}`).join(" · ") : product.priceLabel,
    ...(options ? { options: options.map(({ label, values }) => ({ label, values: values.join(" · ") })) } : {}),
  })));
  assert.deepEqual(JSON.parse(JSON.stringify(normalized)), baseline);
});

test("approved snack prices, quantities and options occupy separate fields", () => {
  const snacks = menuCategories.find(({ id }) => id === "snacks").products;
  assert.deepEqual(snacks.map(({ name, prices, piecesLabel }) => [name, prices[0].value, piecesLabel]), [
    ["Tsuros", "₱100", "5 pieces"], ["Fries", "₱135", undefined],
    ["AshBrawn", "₱140", "3 pieces"], ["NaChoz", "₱185", undefined],
    ["Waffles", "₱105", undefined], ["Oberload Fries", "₱165", undefined],
  ]);
  assert.deepEqual(find("snacks", "churros").options, [{ label: "Dip options", values: ["Chocolate", "Caramel", "Strawberry", "Matcha"] }]);
  const waffle = find("snacks", "waffles");
  assert.deepEqual(waffle.options, [
    { label: "Syrup options", values: ["Chocolate", "Caramel", "Strawberry", "Matcha"] },
    { label: "Toppings", values: ["Almond", "Oreo", "Biscoff", "Choco Chips"] },
  ]);
  assert.equal(waffle.description, undefined);
  assert.deepEqual(find("snacks", "fries").options, [{ label: "Flavor options", values: ["Cheese", "Barbeque", "Sour Cream"] }]);
});

test("all prices render as prices and unknown serving sizes remain absent", () => {
  for (const category of menuCategories) {
    for (const product of category.products) {
      if (category.section === "weekend-cocktails") {
        assert.equal(product.priceLabel, "₱100");
        assert.equal(product.prices, undefined);
      } else {
        assert.equal(product.priceLabel, undefined);
        assert.ok(product.prices.length > 0);
        for (const price of product.prices) assert.match(price.value, /^₱\d+$/);
      }
      if (category.section !== "snacks") assert.equal(product.piecesLabel, undefined);
    }
  }
  assert.deepEqual(find("coffee-based", "ISPANIS LATEY").prices, [{ label: "Hot · 10 oz", value: "₱115" }, { label: "Iced · 16 oz", value: "₱160" }]);
  assert.deepEqual(find("coffee-based", "coffee-affogato").prices, [{ value: "₱140" }]);
  assert.deepEqual(find("fruit-series", "GREYPS TEA").prices, [{ label: "Iced", value: "₱100" }]);
  assert.deepEqual(find("milktea-based", "KUKIS N KRIM").prices, [{ label: "Iced", value: "₱115" }]);
});

test("square snack framing clips only transparent canvas margins", async () => {
  for (const product of menuCategories.find(({ id }) => id === "snacks").products) {
    const file = new URL(`../public${product.image}`, import.meta.url);
    const image = sharp(await readFile(file));
    const { width, height, hasAlpha } = await image.metadata();
    assert.equal(width / height, 4 / 5);
    assert.equal(hasAlpha, true);
    const margin = Math.floor((height - width) / 2);
    for (const top of [0, height - margin]) {
      const alpha = await image.clone().extract({ left: 0, top, width, height: margin }).extractChannel(3).raw().toBuffer();
      assert.ok(alpha.every(value => value === 0), `${product.name}: preserve all artwork inside the square frame`);
    }
  }
});

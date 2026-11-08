# Calle Café

Static, view-only QR menu built with Next.js, TypeScript, Tailwind CSS, and
Swiper. Both `/` and `/menu` render the same six-category menu with 36 products.
The responsive layout uses Fraunces and DM Sans, a compact sticky header,
and independently controlled touch/keyboard sliders.

## Local development

Use Node.js 20.9 or newer (tested locally with Node.js 26.12.1).

```powershell
npm ci
npm run dev
```

Open http://localhost:3000/menu.

## Checks and static export

```powershell
npm run lint
npm run typecheck
npm run build
npm test
```

`npm test` checks menu data and generated static routes, so run the build first.
The export is written to `out/`; deploy that folder to static hosting.
`next start` is not used with this static-export application.

## Browser checks

Install the test browser once, then run the interaction/accessibility suite:

```powershell
npx playwright install chromium
npm run test:browser
```

Playwright starts a development server on port 3000 or reuses one already
running. Tests cover all six independent sliders, keyboard and touch input,
responsive anchors, reduced motion, no-JavaScript browsing, and axe checks.

## QR code

The print-ready QR points to the verified production menu URL:

- `public/calle-menu-qr.svg` — vector, preferred for print.
- `public/calle-menu-qr.png` — 1024×1024 raster preview/share copy.

After the next deployment these are also available at
`https://calle-cafe.pages.dev/calle-menu-qr.svg` and
`https://calle-cafe.pages.dev/calle-menu-qr.png`. The current live site does not
contain them until the owner pushes and redeploys.

Print the QR with **calle-cafe.pages.dev/menu** written beside it. It was generated
with high error correction and verified by automated decoding.

If the permanent production URL changes, regenerate both files and run the tests:

```powershell
npx qrcode -t svg -w 1024 -q 4 -e H -d 352B26 -l F5F0E8 -o public/calle-menu-qr.svg "https://YOUR-FINAL-URL/menu"
npx qrcode -t png -w 1024 -q 4 -e H -d 352B26 -l F5F0E8 -o public/calle-menu-qr.png "https://YOUR-FINAL-URL/menu"
npm test
```

The QR test pins `https://calle-cafe.pages.dev/menu`; update that test if the
permanent URL changes.

## Menu content and images

Edit `src/data/menu.ts` for names, display prices/sizes, and descriptions.
See [content notes](docs/menu-content.md) for poster sources, resolved price
differences, missing values, and image-quality limitations.

```powershell
npm run prepare:images
npm run test:menu
```

Image preparation preserves supplied originals and writes optimized copies
to `public/images/`. It requires the development dependencies installed by
`npm ci`. Cards use only the optimized assets and omit unknown prices.

### Replacing product images

Use a **1200×1500 px, 4:5 portrait** master for drinks and snacks. Weekend
cocktail photos can stay **1200×1200 px** square to match their current
presentation, or use 1200×1500 if they should fill the card. Export WebP at
quality 80–85; do not upscale the existing low-resolution files.

The preparation script caps output at 1200×1500 and never upscales or crops.
Most current drink/snack originals are still only 37–303 px wide and need
replacement before final visual approval.

## Updating the menu after launch

1. Replace the source original in `public/Drinks/...` or
   `public/Foods-Snacks/...`, or add a new category image there.
2. Run `npm run prepare:images` to regenerate the prepared WebPs.
3. Update `src/data/menu.ts` if the name, price, description, category, or
   image slug changed.
4. Run `npm run lint`, `npm run typecheck`, `npm run build`, `npm test`, and
   optionally `npm run test:browser`.
5. Commit and push to the production branch; Cloudflare Pages redeploys `out/`.
6. Reload `/menu` on a phone and confirm the change. **Do not regenerate or
   reprint the QR unless the production URL changes.**

See [to-do.md](to-do.md) for progress and manual Git/GitHub and Cloudflare Pages
instructions. Image-quality approval, price completion, and real-device/QR
acceptance remain launch tasks. Git operations and deployment are owner-managed.

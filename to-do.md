# Calle Café Implementation Plan

> For agentic workers: use the executing-plans skill to implement one phase at a time. Check off tasks only after verification. GitHub and Cloudflare actions belong to the owner; provide instructions instead of performing them.

**Goal:** Build a mobile-first, view-only café QR menu with six independent product sliders.

**Architecture:** A new application in this folder, explicitly authorized by the owner. Local typed menu data and approved local photos feed reusable cards and sliders. Next.js exports a static site for Cloudflare Pages.

**Tech stack:** Next.js App Router, TypeScript, Tailwind CSS, Swiper React, Lucide icons where needed.

**Specifications:**
- `CALLE_CAFE_QR_PRODUCT_SLIDERS_PHASED_PLAN.md` — functionality and phase order.
- `CALLE_CAFE_COZY_EDITORIAL_QR_MENU_DESIGN_GUIDE.md` — visual design and accessibility.

## Decisions and current status

- [x] Read both specifications.
- [x] Audit the initial folder: only the two specifications were present; no app, assets, or Git repository.
- [x] Owner approved creating a new application, replacing the specifications' existing-app assumption.
- [x] Owner reserved GitHub and Cloudflare setup for manual execution.
- [x] Phase 1 foundation complete (local checkpoint `6a2746f`; GitHub setup reported complete by owner).

Local Git setup/checkpoint commands are also provided for the owner below. No remote repositories, pushes, or deployments should be performed by the assistant.

## Global constraints

- One primary route: `/menu`; keep `/` as a working menu entry.
- Exactly three sections and six independent sliders; no invented product content.
- No cart, ordering, checkout, accounts, CMS, database, runtime APIs, or contact form.
- Cream `#F5F0E8`, espresso `#352B26`, mocha `#80624F`, oat `#E8DFD4`, sage `#929B83`, rose `#DFB5AF`.
- Fraunces editorial headings, DM Sans interface text, authentic logo when supplied.
- Compact welcome and sticky header; no giant hero, forced loader, parallax, or autoplay.
- Approved photos, consistent 4:5 framing where suitable, verified optional prices/descriptions.
- Static export to `out/`; production QR targets a stable `/menu` URL.

## Planned file responsibilities

Adapt generated configuration filenames to the installed framework version.

| Files | Responsibility |
| --- | --- |
| `package.json`, lockfile, TypeScript/ESLint/PostCSS configuration, `.gitignore` | Application foundation and checks |
| `next.config.ts` | Static export and compatible image configuration |
| `src/app/layout.tsx`, `src/app/globals.css` | Metadata, typography, shared design tokens |
| `src/app/page.tsx`, `src/app/menu/page.tsx` | Root entry and official menu route |
| `src/components/MenuPage.tsx` | Shared menu composition |
| `src/components/FloatingHeader.tsx` | Brand and three section anchors |
| `src/components/ProductCard.tsx` | Photo and approved product information |
| `src/components/ProductSlider.tsx` | Independent accessible Swiper instance |
| `src/data/menu.ts` | Typed category/product collections |
| `public/images/branding/`, `public/images/products/` | Approved optimized assets |

## Review focus

- Long names and absent prices must remain readable: check in Phase 5.
- Multiple sliders visible at once must not share arrow/keyboard state: check in Phase 5.
- Narrow viewports must not overflow or hide navigation destinations: check in Phases 4 and 8.
- Missing/unapproved content must not become fake public products: check in Phases 2, 3, and 8.
- Direct `/menu` requests and root entry must survive deployment and refresh: check in Phases 6 and 7.

## Phase 1 — Establish and protect the new foundation

**Owner:** Assistant for local app setup; owner for Git/GitHub actions.

- [x] Check Node.js and npm versions against the chosen Next.js release requirements.
- [x] Create the Next.js/TypeScript/Tailwind foundation in this folder, preserving the Markdown documents.
- [x] Add a minimal `/menu` route and working `/` entry without fabricated product content.
- [x] Configure `output: 'export'` and static-compatible image handling.
- [x] Ensure `.gitignore` excludes `node_modules/`, `.next/`, `out/`, and local secrets.
- [x] Run lint, TypeScript checking, and `npm run build`; record actual results below.
- [x] Owner: initialize Git and save the foundation checkpoint using the manual instructions below.

**Done when:** The local app builds and exports, documents are preserved, and the owner has protected the foundation in Git.

## Phase 2 — Prepare approved content and design

- [x] Owner: supply approved names for Coffee Based, Matcha Series, Fruit Series, and Milktea Based.
- [x] Owner: confirm snack names: Churros, Fries, Hash Brown, Nachos, Waffles, Loaded Fries.
- [x] Owner: confirm Weekend Drinks names: Summer Cocktail, Blueberry Pink Cocktail, Blueberry Peach Cocktail, Affogato, Lychee Rainbow Cocktail.
- [x] Owner: supply approved product photos, official wordmark, and optional cat illustration.
- [x] Owner: supply verified price labels and optional descriptions; omit unavailable prices.
- [x] Record missing content explicitly; do not publish placeholder products. See `docs/menu-content.md`.
- [x] Prepare optimized copies under `public/images/products/` without cropping/upscaling; use consistent 4:5 contain framing in Phase 5.
- [ ] Obtain sharper replacements or owner acceptance of low-resolution product artwork before visual launch approval.
- [ ] Review one card, one slider, and the first mobile viewport in Figma before implementing the final layout, as specified by the design guide.
- [ ] Approve full mobile, narrow-phone, tablet, and desktop design adaptations.

**Done when:** Public product content is authentic and the visual layout is approved. Business details are needed only if included.

### Received content inventory

- `public/calle-logo.webp`: supplied brand asset.
- `public/Drinks/`: Coffee Based (7 images), Matcha Series (4), Fruit Series (11), Milktea Based (4), Weekend Cocktails (5).
- `public/Foods-Snacks/`: all six snack images supplied.
- Preserve the supplied playful product spellings; filenames include many hot/iced price labels.
- Owner confirmed Affogato in both Coffee Based and Weekend Cocktails; both use the reference poster's ₱140.
- Read all three images in `public/Menu Reference Price/`; recorded prices, cup sizes, and filename conflicts in `docs/menu-content.md`.
- Four snack prices and some drink sizes are still unknown and omitted; see content notes.
- All 37 assets reviewed and prepared. Many cup images are only 37–71px wide; preserve originals and request higher-resolution replacements for sharp large cards.
- Current `public/` assets are untracked locally; owner should include them in the next manual Git commit.

### Waffles — owner-supplied options

Transcribed from the supplied waffle menu image:

- **Syrup:** Chocolate, Caramel, Strawberry, Matcha.
- **Toppings:** Almond, Oreo, Biscoff, Choco Chips.
- **Price note:** ₱20 for additional toppings.

Present these as readable information with Waffles, not ordering controls. The image does not specify how many toppings are included or whether ₱20 is per topping; do not infer either rule. The subsequently supplied full reference poster gives a waffle base price of ₱105 and Fries at ₱135 (Cheese, Barbeque, Sour Cream).

**Phase 2 status:** Content transcription and asset preparation complete. Image-quality acceptance/replacements and the two Figma/design-approval tasks remain open.

## Phase 3 — Create typed local menu data

- [x] Define `MenuProduct` with `id`, `name`, `image`, `alt`, optional `priceLabel`, and optional `description` in `src/data/menu.ts`.
- [x] Define `MenuCategory` with `id`, `title`, `section`, and `products`; sections are `drinks`, `snacks`, and `weekend-cocktails`.
- [x] Export `menuCategories` with four Drinks categories, one Snacks category, and one Weekend Drinks category.
- [x] Populate approved data and verify every referenced image exists.
- [x] Check category counts, unique IDs, six snack entries, and five weekend entries with a focused data validation check.
- [x] Keep unfinished categories out of public release until all six can ship with approved content (all six are populated; unknown prices are omitted).

**Done when:** All six collections are ready and a data edit updates the corresponding card after rebuilding.

**Phase 3 status:** Complete: 37 entries in six collections. Phase 5 connected the data to cards; static-output checks verify all 37 render.

## Phase 4 — Build navigation and page layout

- [x] Apply shared palette tokens, Fraunces headings, and DM Sans interface text.
- [x] Build `FloatingHeader` with Drinks, Snacks, and Weekend Cocktails anchors.
- [x] Compose compact welcome, three semantic sections, and a small footer in `MenuPage`.
- [x] Add visible focus states, approximately 44×44px minimum tap targets, and anchor scroll offsets.
- [x] Check navigation at 320px and desktop widths; headings must remain visible below the sticky header.
- [x] Confirm the first mobile viewport reveals useful menu content quickly.

**Done when:** The approved page structure is responsive and all three navigation links work.

**Phase 4 status:** Implemented and browser-verified. Owner authorized direct implementation from the supplied design guide; separate Figma approval is not claimed.

## Phase 5 — Implement reusable cards and sliders

- [x] Install Swiper if absent.
- [x] Build `ProductCard` consuming a `MenuProduct`, with reserved image dimensions, alt text, and optional metadata.
- [x] Build client-side `ProductSlider` accepting `id`, `title`, and `products: MenuProduct[]`.
- [x] Instantiate six sliders from local category data.
- [x] Tune visible cards to approximately 1.15 on phones, 2.1 on tablets, and 4 on desktop.
- [x] Scope arrow and focused keyboard controls to each instance; disable loop and autoplay.
- [x] Hide or disable unnecessary controls when products fit; respect reduced motion.
- [x] Verify long names, missing prices, and small product collections without layout breakage.
- [x] Verify touch, mouse, keyboard, independent controls, and absence of page-wide horizontal overflow in a real browser.
- [x] Keep a focused interaction regression check proving one slider's navigation does not move another.

**Done when:** All six sliders work independently and cards remain readable across supported widths.

**Phase 5 status:** Complete. Twelve Chromium browser tests cover independent arrows/keyboard, emulated touch swipe, desktop fit/resize controls, six viewport widths, reduced motion, automated accessibility, and no-JavaScript browsing. Real-device acceptance remains Phase 8.

## Phase 6 — Verify QR routes and static output

- [x] Set metadata title to `Calle Café | Menu`, with an appropriate description and supplied-logo favicon.
- [x] Verify both `/` and `/menu` work without runtime-server features.
- [x] Run lint, TypeScript checking, focused tests, and `npm run build`.
- [x] Serve the generated `out/` as static files and verify direct route loads, refreshes, and image/font assets.
- [x] Record build and route-check results below.

**Done when:** The exported menu is ready for the owner's deployment.

**Phase 6 status:** Complete. Fresh static build verified on a local static server (`http://localhost:3001`). Both `/` and `/menu` return HTTP 200 on direct load and refresh, render 37 cards, and initialize six sliders. All 37 product images plus the logo decode successfully; favicon returns HTTP 200 with an image MIME type; DM Sans and Fraunces load from local exported assets. No browser runtime errors or failed resource responses occurred. No application/configuration changes were needed for this phase. Production-domain and real-phone checks remain owner launch tasks.

## Phase 7 — Manual GitHub, Cloudflare, and QR launch

**Owner:** Café/project owner. Assistant supplies instructions and helps interpret errors.

- [x] Create/connect the GitHub repository and push the reviewed project manually.
- [x] Connect that repository to Cloudflare Pages manually.
- [x] Set production branch, build command `npm run build`, and output folder `out`.
- [ ] Verify the production `/menu` and `/` routes on a real phone.
- [ ] Choose the permanent production domain before generating a QR.
- [ ] Generate a static QR that directly encodes the final HTTPS `/menu` URL.
- [ ] Scan with Android and iPhone cameras before printing; include the readable domain alongside the QR.

**Done when:** The live menu and printed QR work on real devices.

## Phase 8 — Final acceptance and maintenance handoff

- [ ] Verify all approved products, photos, names, and displayed prices.
- [ ] Verify exactly four Drinks sliders, one six-item Snacks slider, and one five-item Weekend Drinks slider.
- [ ] Check widths 320, 375, 390, 430, 768, and 1440px.
- [ ] Check keyboard navigation, focus, contrast, alt text, reduced motion, and touch targets.
- [ ] Check slow mobile loading, image compression, deferred off-screen images, and layout shifts.
- [ ] Confirm there are no ordering/account controls or unfinished public content.
- [ ] Owner: perform a subsequent deployment and confirm the same QR still works.
- [ ] Document product update steps: edit local data/photos, run checks, manually commit/push, and verify the deployed result.

**Done when:** Acceptance checks pass and the owner can update the menu without changing the QR URL.

## Manual instructions — Git and GitHub

Run these yourself after Phase 1 creates the app and `.gitignore`. Review staged files for secrets before committing.

```powershell
git init -b main
git add .
git diff --cached --stat
git status
git commit -m "chore: initialize Calle Cafe menu foundation"
```

If Git requests your identity, configure your intended Git name/email and retry the commit.

1. On GitHub, create an empty repository; do not prepopulate README, license, or `.gitignore`.
2. Copy its HTTPS remote URL and substitute it below.

```powershell
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

For further implementation work, optionally create a local feature branch:

```powershell
git switch -c feat/qr-product-sliders
```

Review and merge finished work into your chosen production branch before deploying it. All pushes and merges remain manual owner actions.

## Manual instructions — Cloudflare Pages

Follow these when Phase 6 passes, not while the menu is incomplete. Dashboard labels may change.

1. Open Cloudflare **Workers & Pages** and choose creation of a **Pages** project using an existing Git repository.
2. Authorize GitHub and select the café repository.
3. Choose the **Next.js static export** preset if offered; do not choose a runtime Workers deployment for this plan.
4. Set production branch to `main` (or your actual production branch).
5. Set build command to `npm run build` and build output directory to `out`.
6. Leave the root directory at the repository root; match the Node.js version used for the verified local build if configuration is needed.
7. Deploy and open the production URL. Check `/menu`, `/`, refreshes, photos, and sliders.
8. Configure your custom domain if wanted, then choose the stable HTTPS `/menu` address.
9. Generate and scan-test the static QR using that address, never a temporary preview URL.

Reference: https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/

## Verification log

### Phase 1 execution notes

- Ruling: create the foundation directly in the approved folder using Next.js's documented manual installation, preserving the existing documents.
- Ruling: keep progress in this file and leave Git/worktree/commit operations to the owner, as requested.
- Ruling: Phase 1 uses a plain preparation message on both routes; final typography, approved assets, and product sliders belong to later phases.
- Static-route regression check first failed because neither exported route existed (expected pre-implementation failure).
- Ruling: retain ESLint 9.39.5 because Next.js's bundled React/accessibility/import plugins reject ESLint 10 peer compatibility. ESLint 9 is deprecated; revisit when those plugins support ESLint 10. Current lint passes.
- Independent read-only review found no Phase 1 correctness blockers. Progress records updated and browser diagnostic artifacts ignored.
- Previous missing-favicon issue resolved in Phase 4: metadata now references the supplied logo asset.

| Date | Check | Result |
| --- | --- | --- |
| 2026-11-07 | Initial folder audit | Two specification files; no application or assets |
| 2026-11-07 | `git rev-parse --show-toplevel` | Not a Git repository |
| 2026-11-07 | Node/npm | Node 26.12.1 / npm 12.2.1; Next.js 16.4.5 requires Node >=20.9.0 |
| 2026-11-07 | `npm run lint` | Pass with compatible ESLint 9 |
| 2026-11-07 | `npm run typecheck` | Pass |
| 2026-11-07 | `npm run build` | Pass; `/` and `/menu` statically exported |
| 2026-11-07 | `npm test` | 2/2 exported-route checks pass after build |
| 2026-11-07 | `npm ls --depth=0` | Pass |
| 2026-11-07 | Browser `/menu` | Opens with correct title; missing favicon 404 deferred to Phase 6 |
| 2026-11-07 | Dependency audit | 8 moderate development-tool findings; `npm audit --omit=dev` reports 0 vulnerabilities |
| 2026-11-07 | Phase 2 asset preparation | 37 products + logo prepared; product copies total 365,476 bytes; all products reviewed in contact sheet |
| 2026-11-07 | Phase 3 regression check | First failed with missing `menu.ts`; then all 4 menu checks passed |
| 2026-11-07 | Phase 2–3 checks | Lint, typecheck, static build, and all 6 tests passed |
| 2026-11-07 | Independent Phase 2–3 review | No correctness blockers; poster transcription checked and 6/6 tests independently passed |
| 2026-11-08 | Phase 4–5 local checks | Lint, typecheck, static build, and 6 data/export tests pass |
| 2026-11-08 | `npm run test:browser` | 12/12 Chromium tests pass at 320/375/390/430/768/1440px; axe reports no WCAG A/AA violations at 390/1440px |
| 2026-11-08 | Static browser smoke check | Export served on port 3001; `/menu` hydrates, normal-motion arrows/keyboard work independently, anchor scrolling works, no broken loaded images |
| 2026-11-08 | Independent Phase 4–5 review | No blockers; requested normal-motion/static verification completed after review |
| 2026-11-08 | Phase 6 fresh quality gates | `npm run lint`, `npm run typecheck`, `npm run build`, and `npm test` pass (6/6 tests) |
| 2026-11-08 | Phase 6 static route/asset checks | `/` and `/menu`: direct load + refresh HTTP 200; 37 cards, 6 initialized sliders, 38 decoded images, favicon HTTP 200, both fonts loaded locally; slider controls work |
| 2026-11-08 | Phase 6 browser errors | Zero page errors and zero failed resource responses during both route checks |

### Phase 4–5 execution notes

- Design contract: short welcome, cream/espresso palette, authentic logo, 4:5 contain-fit product frames, six sliders, and contrasting Weekend section; no purchase actions.
- Owner requested implementation before separate Figma sign-off; built directly from the supplied guide and left visual approval open.
- Keyboard regression reproduced: Swiper consumes `onKeyDown` as a library event. Fixed at the enclosing DOM section, scoped to the focused slider. All interaction tests then passed.
- Preserved an HTML/native horizontal-scroll fallback before hydration or with JavaScript disabled.
- Fonts use Next.js self-hosted Google font output; build-time font retrieval requires network access.
- README contained an appended UTF-16 duplicate heading mixed into UTF-8 text. Normalized it to UTF-8 while updating setup/testing instructions.
- Low-resolution source artwork remains visible as supplied; larger originals are still needed for sharp large cards.

**Phase 1 status:** Complete. Local foundation verified and owner's first Git checkpoint `6a2746f` confirmed. Owner reports GitHub setup complete.

Phases 3–6 are implemented and locally verified. Owner marked GitHub/Cloudflare setup complete; this iteration has not been deployed by the assistant. Visual approval, higher-resolution imagery, production-domain verification, and real-device QR testing remain open.

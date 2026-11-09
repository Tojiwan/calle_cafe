# Drinks and Snacks Slider Redesign Implementation Plan

> **For agentic workers:** Execute this plan task-by-task using `executing-plans`. No subagents, commits, pushes, or deployments unless the owner requests them. Check off tasks only with fresh evidence.

**Goal:** Implement the approved unified drinks/snacks cards and viewport-aware slider progress without changing current menu content.

**Architecture:** Extend the existing `ProductCard` and `ProductSlider`, retaining Swiper and global CSS. Store displayable price variants and individual snack options as structured local data; use the existing slider instance for range, navigation state, and progress geometry.

**Tech stack:** Next.js 16.4.5 static export, React, TypeScript, Swiper 14, existing Tailwind/global CSS, Playwright and Node tests. No new dependencies.

**Spec:** `CALLE_CAFE_DRINKS_SNACKS_SLIDER_REDESIGN.md`; the two user-supplied reference images are visual guides, not replacement content.

**Status:** Implemented and locally verified on 2026-11-09, with Weekend Drinks excluded.

**Subsequent owner refinement (2026-11-09):** The owner reverted equal-height snack surfaces; natural content heights are restored. Cumulative left-anchored progress (`last fully visible item / total`) remains in place instead of the moving viewport thumb. Full final position fills the track, backward movement reduces the fill, and Weekend Drinks remains excluded. Regression checks cover natural heights and filling progress across mobile, tablet, and desktop widths.

## Approved scope amendment and execution ledger

This amendment overrides Weekend Drinks references in the original task details below:
- Redesign only Coffee Based, Matcha Series, Fruit Series, Milktea Based, and Snacks (32 cards).
- Weekend Drinks keeps its existing data, markup appearance, slide widths, dark theme, and counter-only footer. Retain its legacy `priceLabel` field; structured `prices` belong to redesigned cards only.
- Scope new card/slider CSS with explicit variant classes. Do not change shared legacy image or breakpoint rules for Weekend Drinks.
- Verification must include a before/after Weekend comparison and an assertion that no new card header, chips, price grid, or progress track appears there.
- Work in the existing owner workspace; no commits or subagent dispatches, per this plan's instructions. Keep the ledger here rather than introducing a separate execution system.

Progress:
- [x] Task 1: content baseline and structured data — complete fixture preserves all 36 entries; five data checks and typecheck pass after RED→GREEN migration. Weekend values retain the legacy field. Obsolete surcharge assertions now assert the current omission and retain option coverage.
- [x] Task 2: unified drinks/snack cards — 26 drink cards, 6 snack cards, 15 informational chips; full content preserved. Fixed single-price baseline alignment with a failing/passing browser regression.
- [x] Task 3: responsive progress and navigation — endpoint/resize/locked-row checks, touch swipe, normal-motion pointer drag and keyboard tests pass. Weekend footer remains unchanged.
- [x] Task 4: full verification and documentation — lint, typecheck, build, 10 data/static/QR/asset checks and 22 browser tests pass; both exported routes verified with/without JavaScript and all 37 images decoded.

Pre-flight: Tasks 1→2 share prices/options; Tasks 2→3 share card variant and responsive widths; Task 4 covers all. Ruling: legacy Weekend data/markup stays supported alongside the redesigned fields to honor the owner's exclusion, rather than migrating its content unnecessarily.

Visual ruling: the supplied snack images are 1200×1500 transparent canvases with large empty top/bottom margins. A square panel framing a centered 4:5 image removes only transparent margins and enlarges the food. Alpha-band tests protect this assumption for replacements; no image file or food silhouette is cropped. The proposed 4:3 contain-only starting point made the artwork smaller and was rejected after rendered review.

Verification ruling: the shipped smallest collection has four products. Its locked/full-thumb behavior and resize restoration are tested in the actual application; no synthetic one-product route was introduced. Review was performed inline, consistent with the plan's no-subagent instruction. No production code blockers or deferred code fixes were found. Physical-device review and mobile-load remeasurement remain outside this browser-emulated proof.

## Global constraints

- Preserve 36 products, six categories with counts `7/4/11/4/6/4`, order, IDs, image paths/casing, names, amounts, known sizes, quantities, and option spellings.
- Preserve `/`, `/menu`, static export, navigation/scroll sync, welcome, editorial headings, and footer.
- Exclude Weekend Drinks entirely from the redesign, per the owner's explicit scope correction.
- Use current project data over screenshot examples: keep `Barbeque`, `Okininawa`, `Blueberi Tea`, and the current omission of the waffle surcharge.
- No image replacement, cropping, upscaling, regeneration, ordering, selectable chips, autoplay, or extra carousel library.
- Use current palette/fonts. Add one warm-white card token if needed (`#FFFCF9`); maintain text contrast rather than copying faint concept labels.
- Read relevant installed Next.js guides in `node_modules/next/dist/docs/` before implementation; preserve user edits and record a baseline first.

## Audit and file map

| File | Current evidence | Planned responsibility |
| --- | --- | --- |
| `src/data/menu.ts` | All prices are strings; Hot/Iced are joined; option values are dot-separated strings | Explicit price entries and option arrays, preserving content |
| `src/components/ProductCard.tsx` | Shared by every category; media and caption are visually separate | One unified surface, header metadata, drinks price cells, snack chips |
| `src/components/ProductSlider.tsx` | Independent Swiper instances; full-card range already computed with rounding tolerance | Pass card kind/index/total; add actual viewport-position indicator |
| `src/app/globals.css` | 4:5 panels, 24px image padding, approximately 1.15/2.1/4 cards; special weekend colors | Scoped card layout, shorter snack panels, responsive sizing, progress track |
| `tests/menu.test.mjs` | Validates assets and selected menu facts | Complete migration preservation and structured-price assertions |
| `tests/fixtures/menu-content.json` (new) | No full content fixture exists | Reviewed, independent baseline for all 36 entries |
| `tests/browser/menu.spec.ts` | Covers scroll sync, sliders, counters, captions, accessibility, no-JS | Extend coverage for price cells, chips, progress, resizing and input methods |
| `tests/static-export.test.mjs` | Checks both routes and contains obsolete surcharge assertion | Verify redesigned content survives static export |
| `docs/menu-content.md`, `to-do.md` | Contain historical content/testing decisions | Record new data editing shape and verified redesign status |

No separate drinks/snacks carousel, new app scaffold, or navigation rewrite is needed. `MenuPage.tsx` does not need a new data flow.

## Implementation decisions

### Data contract

Use one authoritative price structure rather than a parsed display sentence or duplicated price fields:

```ts
type MenuPrice = { label?: string; value: string };
// In MenuProduct:
prices?: MenuPrice[];
options?: { label: string; values: string[] }[];
```

- Replace `priceLabel` with `prices`; migrate all callers and tests in the same slice.
- The existing `product` helper's fourth argument becomes `prices?: MenuPrice[]`; keep named optional details in the fifth argument.
- Ispanis Latey: `[{ label: "Hot · 10 oz", value: "₱115" }, { label: "Iced · 16 oz", value: "₱160" }]`.
- Fruit teas: `[{ label: "Iced", value: "₱100" }]`; do not manufacture a size.
- Affogato: `[{ value: "₱140" }]`; cocktails: `[{ value: "₱100" }]`. No temperature label inferred.
- Snacks keep one unlabelled price entry. Preserve optional descriptions and quantities.
- Options become arrays of exact existing values; do not split text dynamically in the rendering component.
- Preserve current descriptive alt text. Add illustration/photo details only when supported by the actual asset, not assumed temperatures.

### Card interface and presentation

`ProductCard` receives `{ product, kind: "drink" | "snack", index: number, total: number, priority?: boolean }`. `index` is zero-based and only formatted as one-based for display. `ProductSlider` derives `kind` from its existing `id === "snacks"` condition.

- Warm unified surface, 16px outer radius, 12px internal padding; names remain 18px.
- Drinks: decorative `CALLE CAFÉ` and item index; contain-fit image; name; divider; one or two actual price cells. Right-align the second cell only when present. Reserve two name lines for consistent price baselines without truncation.
- Snacks: index and existing portion (otherwise `Snacks`); contain-fit image; name/price row; divider only when options exist; uppercase group headings and wrapping informational chips.
- Keep `data-product-id`, semantic article/headings, existing alt text, and eager/lazy policy.
- Start drink panels at 4:5 with image padding reduced to 8px; snack panels at 4:3 with 8px padding. Use white image panels where opaque white artwork needs a matching background; no gray sidebands, masks, or altered assets.
- Chips are plain list text, not buttons; use 12–13px type and sufficient contrast. They have no tabindex, pressed state, selection styling, or pointer cursor.
- Snack card surfaces have natural content height; do not stretch every snack card to Waffles' height. Keep image tops aligned. Do not add empty option blocks.
- Explicitly reset card text to espresso in the Weekend section; its existing oat price override must not make warm-card prices unreadable. Keep outside arrows/counter adapted to the dark section.

### Responsive and slider behavior

- Retain `slidesPerView="auto"` and one-card navigation. Start at about 1.2 cards below 768px, 2 at 768px, 3 at 1024px, and 4 at 1200px; use fluid container-based widths and current max-width rather than fixed card pixels.
- Keep gaps 16px mobile / 24px tablet-desktop. Preserve consistent pre-hydration and initialized widths/gaps; update the image `sizes` hint to the new allocation.
- Verify the chosen thresholds against real text. Four cards must not appear earlier if they squeeze prices/options. Mobile peeks are intentional; final position ends flush with the last card.
- Preserve the already-working full-card range (`04–07 / 07`), not the reference screenshot's inconsistent single-index footer. Card header indices remain fixed per item, independently of viewport range.
- Add a thin track with a moving viewport thumb, not a cumulative loading fill. In `sync`, derive `fraction = clamp(swiper.size / swiper.virtualSize, 0, 1)` and `offset = clamp(swiper.progress, 0, 1) * (1 - fraction)`; guard zero size. Locked sliders use `fraction=1`, `offset=0`.
- Track thumb width is `fraction * 100%`; left offset is `offset * 100%`. Reuse existing update/translate/resize events so dragging, arrows, snapping, and resizes agree.
- Progress is decorative (`aria-hidden`); the existing single live status communicates the range. Hide dynamic progress until initialized; retain readable cards and native horizontal scrolling without JS.
- Keep 44px controls, focus rings, disabled edges, reduced motion, and independent keyboard/touch behavior. Do not reintroduce the removed instruction sentence.

## Review focus

1. Price migration: all six Hot/Iced pairs, iced-only items, price-only items, and unknown sizes must preserve every value; prove with a complete reviewed fixture in Task 1.
2. Progress limits: partial peeks, final snap, locked collections, and resizing at the end must never produce out-of-track geometry or ranges above total; cover in Task 3.
3. Long content: Waffles' two groups and long names must wrap without clipping or stretching all snack surfaces; inspect and assert in Task 4.
4. Input/accessibility: pointer drag, touch swipe, keyboard, normal/reduced motion, and dark-section contrast must work; cover in Tasks 3–4.
5. Static delivery: both routes must retain prices/options with no JS and no image failures; verify fresh export in Task 4.

## Task 1 — Preserve content and introduce structured pricing

**Files:** `src/data/menu.ts`, `src/components/ProductCard.tsx` (temporary compatible rendering), `tests/menu.test.mjs`, new `tests/fixtures/menu-content.json`, `tests/static-export.test.mjs`, `tests/browser/menu.spec.ts`.

- [x] Recorded workspace and Weekend visual baseline; preserved unrelated owner files.
- [x] Froze all 36 entries in a reviewed fixture, including the absent waffle surcharge.
- [x] Watched the data-contract tests fail, migrated scoped prices/options, and verified all data tests and typecheck passed.
- [x] Preserved legacy Weekend strings; no duplicate price truth or runtime sentence parser added.
- [x] Corrected outdated surcharge tests without removing option/base-price coverage.
- [x] Verified 36 priced products and 42 actual price values, plus exact asset casing and inventory counts.

## Task 2 — Unified cards and approved visual hierarchy

**Files:** `src/components/ProductCard.tsx`, `src/components/ProductSlider.tsx`, `src/app/globals.css`, `tests/browser/menu.spec.ts`.

- [x] Watched the new card contract fail, then implemented kind/index/total, real labelled price cells, portion headers, and noninteractive chips.
- [x] Added conditional dividers, two Waffles option groups, compact no-option surfaces, and natural snack card heights.
- [x] Adjusted responsive widths and image hints; rejected undersized 4:3 snack presentation in favor of tested square framing.
- [x] Verified loaded-image renders at phone/tablet/desktop sizes and preserved Weekend appearance.
- [x] Proved and fixed Affogato's price baseline mismatch (16.5px before fix; within 1px afterward) without inventing a variant label.

## Task 3 — Actual viewport progress and responsive navigation

**Files:** `src/components/ProductSlider.tsx`, `src/app/globals.css`, `tests/browser/menu.spec.ts`.

- [x] Watched progress tests fail before implementation; added fraction/offset to the existing state and five decorative tracks.
- [x] Verified viewport/content ratio, initial/final positions, resizing at the end, and the full-width locked thumb at 390/768/1024/1440px.
- [x] Preserved existing full-card range calculations and the 1px rounding tolerance.
- [x] Verified independent arrows/keyboard, synthesized touch, and desktop pointer dragging under normal/reduced motion. Locked-state coverage uses the shipped four-product collections as recorded above.

## Task 4 — Complete responsive/static verification and handoff

**Files:** tests above as needed, `docs/menu-content.md`, `to-do.md`, this plan.

- [x] Checked eight widths from 320–1440px, layout overflow, long content, natural card heights, scrolling selection and anchor clearance.
- [x] Automated accessibility, focus, touch-target, keyboard and reduced-motion checks pass; chips have no interactive descendants.
- [x] Lint, typecheck, build, all 10 data/static/QR/asset checks and 22 browser tests pass with no skipped tests.
- [x] Fresh static server on port 3002: `/` and `/menu` HTTP 200 with/without JavaScript; 36 cards, 42 prices, 15 chips, all 37 images decode, no page errors/overflow, native scrolling available without JS.
- [x] Reviewed actual rendered cards against the references and Weekend before/after; alpha tests verify the snack frame preserves all nontransparent artwork.
- [x] Updated content documentation and `to-do.md`. No commits, pushes, deployments, physical-device checks, or new performance measurements performed.

## Stop condition

Approved card layouts and accurate viewport progress are implemented; all current content is preserved; full checks and responsive visual review pass; documentation records actual results. No unrelated header/hero redesign, asset optimization project, or new feature work.

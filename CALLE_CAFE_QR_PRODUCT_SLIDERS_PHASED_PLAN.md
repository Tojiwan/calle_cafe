# CALLE CAFÉ — QR MENU WITH PRODUCT SLIDERS

**Implementation plan · Simplified current scope · November 2026**  
**Project type:** Static, mobile-first, view-only digital café menu  
**Stack:** Existing Next.js + TypeScript + Tailwind CSS project → static export → Cloudflare Pages  
**Primary entry:** QR code opens `/menu` directly  
**Content:** Local product data and local product photographs, managed through the repository  
**No:** ordering, cart, checkout, account registration, admin panel, database, CMS, or contact form

> **Implementation rule:** Continue in the existing Calle Café repository. Do not recreate the project or overwrite working components blindly. Audit what exists, keep useful styles/assets, and replace the poster-only presentation with the product-slider layout described here.

---

## 1. Final scope and information architecture

The site is a **single primary menu experience**: a floating, sticky navigation header; three large section titles; and six category-specific product sliders. The QR code is a printed link to the deployed menu, **not** a login or ordering mechanism.

### Navigation structure

- **Floating sticky header:** Calle Café logo or wordmark, **Drinks**, **Snacks**, **Weekend Cocktails**. On narrow phones, keep labels reachable by horizontal scrolling or a compact accessible menu; avoid wrapping into an oversized header.
- **Drinks** (`#drinks`): four separate horizontal sliders:
  1. **Coffee Based** (`#coffee-based`)
  2. **Matcha Series** (`#matcha-series`)
  3. **Fruit Series** (`#fruit-series`)
  4. **Milktea Based** (`#milktea-based`)
- **Snacks** (`#snacks`): **one slider** with these six named products:
  - Churros
  - Fries
  - Hash Brown
  - Nachos
  - Waffles
  - Loaded Fries
- **Weekend Cocktails** (`#weekend-cocktails`): **one slider** with these five named items:
  - Summer Cocktail
  - Blueberry Pink Cocktail
  - Blueberry Peach Cocktail
  - Affogato
  - Lychee Rainbow Cocktail

**Total: 6 independently controlled product sliders.** The Drinks product names, product prices, images, descriptions, and any hot/iced price labels must be verified or supplied; don't invent them. The snack and cocktail names above are the supplied labels, not a verified price list.

### Visual hierarchy (mobile-first)

```text
┌─────────────────────────────────┐
│ [ CALLE CAFÉ ]  Drinks Snacks … │  ← floating sticky header
└─────────────────────────────────┘

  DRINKS
  Coffee Based               ‹  ›
  [photo + name + price] [next →]
  Matcha Series              ‹  ›
  [photo + name + price] [next →]
  Fruit Series               ‹  ›
  [photo + name + price] [next →]
  Milktea Based              ‹  ›
  [photo + name + price] [next →]

  SNACKS
  Snacks                     ‹  ›
  [Churros] [Fries] [Hash Brown] →

  WEEKEND COCKTAILS
  Weekend Drinks             ‹  ›
  [Summer Cocktail] [Blueberry…] →

  [Visit info / social links (optional)]
  [Calle Café footer]
```

### Product-card requirements

Each item card should display:

1. A real product photo, with consistent framing and no text baked into the image.
2. Product name (always).
3. Verified price or verified price range **only when available**; omit the price instead of showing a placeholder amount on the public site.
4. Optional short verified description (e.g., flavor notes) if provided by the café.

No plus buttons, quantity buttons, 'Buy', 'Order Now', or price selectors. A simple tap-to-enlarge photo is optional; it must not interfere with slider swipes.

---

## 2. Design rules

Retain **The Cozy Calle** visual identity without building an elaborate multi-page parallax site:

| Token | Value | Use |
|---|---|---|
| Warm Cream | `#F5F0E8` | Page background |
| Espresso | `#352B26` | Main text / header text |
| Mocha | `#80624F` | Accent text / controls |
| Soft Oat | `#E8DFD4` | Card background / borders |
| Sage | `#929B83` | Small decorative accent |
| Dusty Rose | `#DFB5AF` | Small decorative accent |

- **Typography:** Fraunces for `Drinks`, `Snacks`, `Weekend Cocktails` headers; DM Sans for navigation, item names and prices. Use the original Calle Café brand asset if available.
- **Floating sticky header:** pill or softly rounded rectangle, subtle solid/blurred cream surface, thin border or restrained shadow, `position: sticky`, offset from top, high-enough z-index, no oversized persistent overlay.
- **Cards:** photo-led, restrained spacing, consistent 4:5 or 1:1 media area, responsive text and price alignment. Avoid glassmorphism, e-commerce styling, distracting animation and dense grids.
- **Sliders:** touch-swipe on mobile; visible next/previous controls when useful, keyboard support and labelled groups; do not autoplay by default.
- **Accessibility:** at least approximately 44px touch targets, visible focus outlines, semantic section headings, readable contrast, reduced-motion support, and `scroll-margin-top` on anchor targets to account for sticky header.
- **Performance:** optimized WebP/AVIF/JPEG photos, reserve dimensions, lazy-load offscreen items, prioritize first visible products, and avoid shipping full-resolution poster files into every product card.

---

## 3. Technology decisions

| Concern | Decision |
|---|---|
| Site | Existing Next.js App Router + TypeScript project |
| Styles | Existing Tailwind CSS setup |
| Sliders | Swiper React (one reusable `ProductSlider` component) |
| UI icons | Existing Lucide icons or `lucide-react` |
| Animations | CSS transitions first; no GSAP/parallax required |
| Product data | `src/data/menu.ts` or equivalent local typed file |
| Product images | `public/images/products/…` in the repository |
| Hosting | Cloudflare Pages static site |
| QR | One static QR encoding the final production `/menu` URL |

**Static export check** (only update if missing in the current code):

```ts
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
};

export default nextConfig;
```

Do not use API routes that run at request time, Server Actions, a database, authenticated pages, or server-side upload handling. The sliders run entirely in the browser, and the menu content is shipped with each deployment.

---

# Phased implementation (continue the existing project)

## Phase 1 — Audit and protect existing work

**Goal:** Reuse the working Next.js foundation and identify what needs modification.

**Manual developer actions**

1. Open the **existing** Calle Café repository in VS Code.
2. Inspect `app/` or `src/app/`, `components/`, `public/`, `package.json`, and `next.config.ts`.
3. Confirm whether `/menu` already exists, whether the old poster viewer is still used, and whether any QR codes already point to `/`.
4. Save working changes before editing:

   ```powershell
   git status
   git add .
   git commit -m "chore: checkpoint before QR product slider redesign"
   git switch -c feat/qr-product-sliders
   ```

   If there are no changes to commit, skip the `git add` and `git commit` lines. If your repository uses a different branching workflow, follow it.
5. Identify reusable brand fonts, colors, logo, header, footers, and responsive utilities. Retain them if they work.

**Deliverable:** Brief implementation inventory, a safe branch/commit, and a list of old poster-only UI components to update or retire.

**Done when:** Existing source code and QR destination have been verified; no duplicate Next.js project was created.

## Phase 2 — Prepare authentic product content and photos

**Goal:** Get consistent product data before designing sliders.

**Manual café/developer actions**

1. Prepare **one approved photo per product** (or an approved shared image where appropriate). For Drinks, collect the actual item names under each of the four categories.
2. Confirm actual price labels and whether prices differ for sizes or hot/iced service. Prices may be shown as static text; **do not add customer selection controls**.
3. Confirm spellings, especially the five Weekend Cocktail names; retain requested names until approved corrections are supplied.
4. Export product photos at consistent aspect ratios. Start with a visual standard such as portrait 4:5 for cards, at suitable pixel dimensions (for example 640×800) and compressed sizes. Keep original high-resolution masters outside of deployment assets if practical.
5. Store the website-ready images in a predictable folder layout:

   ```text
   public/images/products/
     coffee-based/
     matcha-series/
     fruit-series/
     milktea-based/
     snacks/
       churros.webp
       fries.webp
       hash-brown.webp
       nachos.webp
       waffles.webp
       loaded-fries.webp
     weekend-cocktails/
       summer-cocktail.webp
       blueberry-pink-cocktail.webp
       blueberry-peach-cocktail.webp
       affogato.webp
       lychee-rainbow-cocktail.webp
   ```

6. If artwork or prices are missing, track them in a content checklist. Do not present invented content as official on the published website.

**Deliverable:** Approved asset list and complete verified local data for all public cards.

**Done when:** Every displayed item has a legitimate name, image, and verified price if a price is displayed.

## Phase 3 — Implement static typed menu data

**Goal:** Keep the six sliders data-driven and easy to maintain without a backend.

Suggested data shape (example, adapt to existing project conventions):

```ts
// src/data/menu.ts
export type MenuProduct = {
  id: string;
  name: string;
  image: string;
  alt: string;
  priceLabel?: string;   // omit until verified
  description?: string;  // omit until verified
};

export type MenuCategory = {
  id: string;
  title: string;
  section: 'drinks' | 'snacks' | 'weekend-cocktails';
  products: MenuProduct[];
};

export const menuCategories: MenuCategory[] = [
  { id: 'coffee-based', title: 'Coffee Based', section: 'drinks', products: [] },
  { id: 'matcha-series', title: 'Matcha Series', section: 'drinks', products: [] },
  { id: 'fruit-series', title: 'Fruit Series', section: 'drinks', products: [] },
  { id: 'milktea-based', title: 'Milktea Based', section: 'drinks', products: [] },
  {
    id: 'snacks', title: 'Snacks', section: 'snacks',
    products: [
      { id: 'churros', name: 'Churros', image: '/images/products/snacks/churros.webp', alt: 'Calle Café churros' },
      { id: 'fries', name: 'Fries', image: '/images/products/snacks/fries.webp', alt: 'Calle Café fries' },
      { id: 'hash-brown', name: 'Hash Brown', image: '/images/products/snacks/hash-brown.webp', alt: 'Calle Café hash brown' },
      { id: 'nachos', name: 'Nachos', image: '/images/products/snacks/nachos.webp', alt: 'Calle Café nachos' },
      { id: 'waffles', name: 'Waffles', image: '/images/products/snacks/waffles.webp', alt: 'Calle Café waffles' },
      { id: 'loaded-fries', name: 'Loaded Fries', image: '/images/products/snacks/loaded-fries.webp', alt: 'Calle Café loaded fries' },
    ],
  },
  {
    id: 'weekend-cocktails', title: 'Weekend Drinks', section: 'weekend-cocktails',
    products: [
      { id: 'summer-cocktail', name: 'Summer Cocktail', image: '/images/products/weekend-cocktails/summer-cocktail.webp', alt: 'Calle Café Summer Cocktail' },
      { id: 'blueberry-pink-cocktail', name: 'Blueberry Pink Cocktail', image: '/images/products/weekend-cocktails/blueberry-pink-cocktail.webp', alt: 'Calle Café Blueberry Pink Cocktail' },
      { id: 'blueberry-peach-cocktail', name: 'Blueberry Peach Cocktail', image: '/images/products/weekend-cocktails/blueberry-peach-cocktail.webp', alt: 'Calle Café Blueberry Peach Cocktail' },
      { id: 'affogato', name: 'Affogato', image: '/images/products/weekend-cocktails/affogato.webp', alt: 'Calle Café affogato' },
      { id: 'lychee-rainbow-cocktail', name: 'Lychee Rainbow Cocktail', image: '/images/products/weekend-cocktails/lychee-rainbow-cocktail.webp', alt: 'Calle Café Lychee Rainbow Cocktail' },
    ],
  },
];
```

**Important:** The four Drinks arrays above are intentionally empty examples because their individual product names were not supplied in the latest requirement. Fill them with approved entries before shipping. Don't publish empty-looking category carousels; either complete the data or clearly hold back an unfinished section until it is ready.

**Deliverable:** Six real category collections, valid image references, and no missing production assets.

**Done when:** Editing an item in the local data changes the appropriate product card after rebuilding.

## Phase 4 — Build floating sticky header + page sections

**Goal:** Make the menu quick to browse immediately after scanning.

**Navigation**

- Header shows Calle Café wordmark and links to `#drinks`, `#snacks`, `#weekend-cocktails`.
- Use a floating inset layout (e.g., centered, max-width with top margin), sticky positioning and compact height.
- Anchor links should jump/scroll to the correct section. Add `scroll-margin-top` to targets so headings don't disappear behind the header.
- On small phones, nav may scroll horizontally. Provide visible active/focus states and do not let horizontal nav scrolling trigger unintended vertical page movement.

**Main sections**

- **`Drinks` heading** → Coffee Based slider → Matcha Series slider → Fruit Series slider → Milktea Based slider.
- **`Snacks` heading** → Snacks slider showing the six named snack products.
- **`Weekend Cocktails` heading** → `Weekend Drinks` slider showing the five named products.

Keep the page clean: no giant pre-menu hero, no forced loader, no poster gallery, no separate About/Visit pages required for this scope.

**Deliverable:** Full page structure with working anchor navigation and a responsive sticky header.

**Done when:** The three top navigation options reach their sections on a narrow phone and a desktop.

## Phase 5 — Implement one reusable product slider

**Goal:** Build the slider once and reuse it six times.

**Manual package setup** (if not already installed):

```powershell
npm install swiper
```

Swiper React exposes `Swiper`/`SwiperSlide` and optional `Navigation`, `Keyboard`, `A11y` and `Pagination` modules. See https://swiperjs.com/react/.

**Implementation guidance**

- Create `ProductSlider.tsx` as a client component (`'use client'`) accepting `title`, `products`, and a stable `id`.
- Render product cards from local data; use a consistent photo ratio and accessible alt text.
- Suggested breakpoints (tune against real layout):
  - Mobile: ~1.15 cards visible (reveals swipe affordance)
  - Tablet: ~2.1 cards
  - Desktop: ~3–4 cards
- Enable touch dragging, keyboard navigation when slider has focus, accessible previous/next buttons, and optional pagination indicators.
- Each of the six sliders must have **independent navigation state**. Scope controls to the component instance. Do not let one category's arrow move another category.
- Disable loop/autoplay initially. Respect `prefers-reduced-motion` and avoid motion that interferes with reading names/prices.
- If a category has fewer items than visible slots, hide unnecessary controls rather than repeating cards.

**Deliverable:** A reusable slider + card component applied to all six categories.

**Done when:** Every populated category slides independently by touch, mouse, keyboard and controls, without horizontal page overflow.

## Phase 6 — QR route and static-hosting configuration

**Goal:** Make one stable, public menu destination.

1. Make **`/menu`** the official QR destination.
2. If old printed QR codes already point to `/`, **preserve `/` as a working way to reach the menu** (render the same menu or offer a visible immediate menu link). Do not break already distributed codes.
3. Preserve or add the Next.js static export configuration from Section 3.
4. Ensure no server-only features are necessary. Client-side Swiper interaction works in a static export.
5. Add site metadata: `Calle Café | Menu`, a relevant description, favicon, and optional social sharing image.
6. Build locally:

   ```powershell
   npm run build
   ```

7. Verify the generated `out/` directory includes a working menu route and its assets.

**Deliverable:** Statically built `/menu` page ready for deployment.

**Done when:** The site builds without database, API or runtime-server dependencies.

## Phase 7 — Deploy to Cloudflare Pages and generate QR

**Manual Cloudflare setup** (skip creation if the existing Pages project is already connected):

1. Push the finished feature branch, review, and merge into the production branch according to your repository workflow.
2. Go to **Cloudflare Dashboard → Workers & Pages → Create application → Pages → Import an existing Git repository**, or open the existing project.
3. Select the existing GitHub repository. Use **Next.js (Static HTML Export)** preset.
4. Set production branch (e.g., `main`), build command `npx next build` (or `npm run build`), output directory **`out`**.
5. Deploy and open the production address; test the menu **on a real phone**.
6. Choose the **final stable URL**, such as `https://your-cafe.pages.dev/menu` or `https://yourdomain.com/menu`. Avoid preview deployment URLs and do not print an unverified destination.
7. Generate a **static QR**. One optional approach is the `qrcode` npm CLI:

   ```powershell
   npm install -D qrcode
   npx qrcode -o public/calle-menu-qr.svg "https://YOUR-FINAL-URL/menu"
   ```

   Replace the example URL with the actual production URL. Check the CLI behavior in your installed version; a trustworthy offline QR generator that directly encodes the full URL is also fine.
8. Verify the QR using Android and iPhone cameras, then print it with a human-readable domain beside it.

**Deliverable:** Live website and tested static QR code.

**Done when:** Scanning the printed code opens the live `/menu`, every slider works, and menu photos are clear.

## Phase 8 — Test, handoff and maintenance

**Functional checklist**

- [ ] Floating sticky header never hides section headings.
- [ ] Three navigation links: Drinks, Snacks, Weekend Cocktails.
- [ ] **Four** Drinks sliders are separately populated: Coffee Based, Matcha Series, Fruit Series, Milktea Based.
- [ ] **One** Snacks slider has all six specified items.
- [ ] **One** Weekend Drinks slider has all five specified items.
- [ ] Product photos, names and verified prices are correct.
- [ ] No cart, checkout, ordering, login or admin controls appear.
- [ ] Swiping one slider doesn't move another.
- [ ] No unintended page-wide horizontal scrollbar.
- [ ] Good experience at phone widths ~320, 375, 390 and 430px; tablet and desktop checked.
- [ ] All meaningful controls work with keyboard, and images have suitable alt text.
- [ ] On slow mobile data, first useful content appears quickly; images below the fold are deferred.
- [ ] Reduced-motion preference doesn't block usability.
- [ ] `npm run build` works and Cloudflare publishes `out`.
- [ ] QR opens the verified production URL and remains stable after another deployment.

**How to update a product after launch**

1. Replace or add a compressed product photo under `public/images/products/` if needed.
2. Update the name, image path, verified price label or category in the local typed menu data.
3. If image caching is an issue, use a versioned filename and update its reference.
4. Run `npm run build`; inspect the affected slider on mobile.
5. Commit and push the change to the production branch; Cloudflare Pages redeploys automatically.
6. Reload `/menu` on a phone and confirm the result. **The QR code does not need to be reprinted while the URL stays unchanged.**

---

## Suggested simplified project tree

```text
calle-cafe/                   # Existing project, not a new app
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx           # Reuse menu or preserve old QR path
│   │   ├── menu/
│   │   │   └── page.tsx       # QR target
│   │   └── globals.css
│   ├── components/
│   │   ├── FloatingHeader.tsx
│   │   ├── MenuPage.tsx
│   │   ├── ProductSlider.tsx
│   │   └── ProductCard.tsx
│   └── data/
│       └── menu.ts
├── public/
│   ├── images/
│   │   ├── branding/
│   │   └── products/
│   │       ├── coffee-based/
│   │       ├── matcha-series/
│   │       ├── fruit-series/
│   │       ├── milktea-based/
│   │       ├── snacks/
│   │       └── weekend-cocktails/
│   └── calle-menu-qr.svg
├── next.config.ts
└── package.json
```

Adapt `src/` to the existing repository; if your code already lives directly under `app/`, do **not** move everything solely to match this example.

## Prompt for OpenCode / Claude Code

> Update the **existing** Calle Café Next.js + TypeScript + Tailwind repository to a **single-view, mobile-first, static QR menu with product sliders**. Do not scaffold a new project. Preserve reusable working styling and assets. Add a compact floating sticky header with anchor links Drinks, Snacks, Weekend Cocktails. Under **Drinks**, build four independent photo-driven sliders: Coffee Based, Matcha Series, Fruit Series and Milktea Based. Under **Snacks**, build one slider for Churros, Fries, Hash Brown, Nachos, Waffles and Loaded Fries. Under **Weekend Cocktails**, build one `Weekend Drinks` slider for Summer Cocktail, Blueberry Pink Cocktail, Blueberry Peach Cocktail, Affogato and Lychee Rainbow Cocktail. Use one reusable accessible Swiper component, independently controlled by category, optimized local photos and typed local static data. Show only verified prices and descriptions. Keep a warm cream/espresso Calle Café aesthetic, no large hero, no poster gallery, no parallax requirement, and no cart, ordering, payment, account, database, admin panel or backend. The QR destination is `/menu`; preserve any already printed root-route QR links. Retain Cloudflare Pages static export compatibility (`out`). Before modifying code, audit the existing implementation and list reusable and removable components. Implement and test changes in phases; check responsive touch/keyboard behavior and `npm run build` before deployment.

## Official reference links

- Cloudflare Pages Next.js static export: https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/
- Swiper React: https://swiperjs.com/react
- Next.js static export guidance: https://nextjs.org/docs/app/guides/static-exports

**Final guiding principle:** QR → readable menu immediately → choose a category → swipe its product images. No purchases, no backend, no detours.

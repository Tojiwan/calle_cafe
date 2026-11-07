# CALLE CAFÉ — Cozy Editorial QR Menu Design Guide

**Design specification · November 2026**  
**Concept:** *The Neighborhood Menu*  
**Visual direction:** Cozy Editorial Minimalism  
**Primary experience:** A mobile-first, view-only digital café menu, opened by scanning a QR code  
**Status:** Proposed design direction for implementation in the **existing** Calle Café repository

> **North star:** “Made for slow days and good company.”  
> Create a menu that is welcoming, handcrafted, easy to read, and quick to browse—without looking or behaving like an e-commerce store.

---

## 1. Purpose and design decisions

Calle Café wants visitors to feel at home: relaxed, comfortable, and welcome to linger over affordable food and drinks. The digital menu should express that personality while serving a practical purpose: **help someone find a drink or snack within seconds of scanning the QR code.**

This design guide interprets the latest **CALLE_CAFE_QR_PRODUCT_SLIDERS_PHASED_PLAN(1).md** implementation plan. It **supersedes the earlier multi-page/parallax website direction for the current scope**. Preserve compatible brand assets and working components, but do not build a full homepage, About page, location page, or animated shop experience as part of this phase.

### Design principles

1. **Menu first.** Customers should see menu content immediately; no full-screen intro, forced preloader, or giant hero.
2. **Beautiful but useful.** Strong type and thoughtful photography should not compromise prices, navigation, or legibility.
3. **Warm rather than luxurious.** A cozy neighborhood café, not a premium-exclusive boutique or corporate ordering platform.
4. **Editorial, not commercial.** Use meaningful section headings, calm spacing, and product photography; avoid purchase affordances.
5. **Quiet personality.** The existing Calle Café wordmark and cat motif can appear as subtle brand details, not an overwhelming mascot theme.
6. **Lightweight and accessible.** Prioritize mobile performance, readable contrast, touch interaction, keyboard use, and reduced motion.

### In scope

- One primary public route: `/menu`.
- A small floating/sticky header with **Drinks**, **Snacks**, **Weekend Cocktails** anchors.
- A short welcome statement.
- **Six independent horizontal product sliders** across three menu sections.
- Product photos, names, and **only approved/verified** prices and descriptions.
- A friendly footer; visit details and social links are optional if verified.
- Static deployment to Cloudflare Pages.

### Explicitly out of scope

Shopping carts, add-to-cart buttons, purchase actions, quantity controls, checkout, payment, accounts, user registration, admin dashboards, CMS, database, ordering system, contact form, poster-only gallery, large parallax hero, GSAP dependency, or extra multi-page website flows.

---

## 2. Visual identity — “The Neighborhood Menu”

The design should feel like a **contemporary café journal**: soft cream paper, brown coffee tones, confident editorial headings, large beautiful food-and-drink photography, uncluttered product labels, and small touches of illustration.

**Three layers of visual character:**

| Layer | Treatment | Purpose |
| --- | --- | --- |
| Cozy | Cream surfaces, warm brown typography, comfortable spacing | Makes the menu approachable and relaxing |
| Editorial | Distinctive display headings, strong alignment, consistent photo crops | Makes it feel deliberately art-directed |
| Handcrafted | Original Calle Café logo, occasional cat detail, optional restrained illustrations | Connects the digital menu with the printed brand |

### What to preserve from the original artwork

- Use the **original Calle Café wordmark** whenever a usable web asset exists; do not approximate the brand lettering with a generic font.
- Retain the warm, illustrated character of the posters as **inspiration**, but use **individual product photos** in the new sliders.
- Integrate the cat in one or two meaningful locations, such as an end-of-page illustration or small welcome detail.
- Keep spelling and official item names based on approved café content, not invented marketing copy.

### What not to imitate

- Product cards styled like online shop listings.
- Black-on-black gothic aesthetics or full-screen luxury branding.
- Huge decorative gradients, glassmorphism, shiny floating badges, excessive shadows.
- Animated objects crossing over readable menu content.
- Generic stock photos in the final public site; use the café's approved product photography.

---

## 3. Color system

The proposed palette preserves the earlier **Cozy Calle** colors. Suggested use is more disciplined: cream is the default canvas; espresso is the main reading color; mocha supports interaction; sage and dusty rose are small accents.

| Token | Hex | Intended use |
| --- | --- | --- |
| `--calle-cream` | `#F5F0E8` | Main page background |
| `--calle-espresso` | `#352B26` | Main text, headings, strong controls, optional weekend backdrop |
| `--calle-mocha` | `#80624F` | Secondary text, thin lines, interactive accents |
| `--calle-oat` | `#E8DFD4` | Subtle separators, card/photo surfaces, light controls |
| `--calle-sage` | `#929B83` | Small decorative/natural details |
| `--calle-rose` | `#DFB5AF` | Warm playful details and small accents |
| `--calle-white` | `#FFFFFF` | Elevated header surface when needed |

### Palette rules

- **Default page:** Cream background + Espresso text.
- **Menu photos:** Prefer their own clean neutral backgrounds; do not add heavy borders by default.
- **Header:** Warm white or cream, subtle oat border, low shadow.
- **Primary navigation emphasis:** Espresso or another tested high-contrast style.
- **Weekend Cocktails section:** Optionally use an Espresso background with Cream headings and labels. Keep product-photo backgrounds visually consistent within it.
- **Sage and Rose:** Decorative use only unless foreground/background color contrast is verified.
- **Contrast check:** Check all text and controls against their actual background before release. Do not rely on a pastel as the only indication of an active/selected state.

### Example CSS tokens

```css
:root {
  --calle-cream: #F5F0E8;
  --calle-espresso: #352B26;
  --calle-mocha: #80624F;
  --calle-oat: #E8DFD4;
  --calle-sage: #929B83;
  --calle-rose: #DFB5AF;
  --calle-white: #FFFFFF;
}
```

---

## 4. Typography

### Pairing

- **Fraunces:** Page-level editorial display headings (`Drinks.`, `Snacks.`, `Weekend Cocktails.`), and possibly the short welcome line.
- **DM Sans:** Header navigation, category titles, product names, prices, instructions, and utility text.
- **Official Calle Café wordmark:** Brand presentation only; use its supplied asset.

### Suggested hierarchy

| Element | Mobile starting size | Desktop starting size | Notes |
| --- | --- | --- | --- |
| Welcome headline | 28–36px | 42–54px | Short, friendly, max 2–3 lines |
| Main section heading | 40–54px | 64–84px | Expressive, distinct section opener |
| Category/slider heading | 20–24px | 24–30px | Easily scannable |
| Product name | 16–18px | 17–20px | Never squeezed into illegibility |
| Verified price | 15–17px | 16–18px | Obvious but not larger than the product name |
| Body/support text | 14–16px | 15–17px | Main reading copy should generally be at least 16px |
| Eyebrow / section index | 11–13px | 12–14px | Decorative only; do not put essential information here |

Use moderate line heights. Limit decorative all-caps to short labels; don't apply it to all product names. Support long names gracefully rather than forcing one line or hiding the name.

---

## 5. Information architecture

### Page structure

```text
/menu
  ├── Floating sticky header
  │     Calle Café wordmark | Drinks | Snacks | Weekend Cocktails
  ├── Short welcome
  │     “Something good is waiting.”
  │     “Take a look around. Find your comfort.”
  ├── Drinks                  #drinks
  │     ├── Coffee Based     #coffee-based        → slider 1
  │     ├── Matcha Series    #matcha-series       → slider 2
  │     ├── Fruit Series     #fruit-series        → slider 3
  │     └── Milktea Based    #milktea-based       → slider 4
  ├── Snacks                  #snacks             → slider 5
  ├── Weekend Cocktails       #weekend-cocktails  → slider 6
  │     Label: Weekend Drinks
  └── Footer
        Short sign-off, optional approved visit/social details
```

**Exact scope:** 3 primary sections, 6 independent product sliders. No additional product categories should be silently introduced.

### Known products from the current implementation plan

**Snacks (six items):** Churros, Fries, Hash Brown, Nachos, Waffles, Loaded Fries.

**Weekend Cocktails / Weekend Drinks (five items):** Summer Cocktail, Blueberry Pink Cocktail, Blueberry Peach Cocktail, Affogato, Lychee Rainbow Cocktail.

**Drinks:** Four categories are defined, but the current latest plan does not supply a final, verified product list for each. Do not invent names, prices, sizes, images, or descriptions for production. Collect approved item data before publishing.

**Naming note:** `Weekend Cocktails` is the main navigation/section name, while `Weekend Drinks` is the inner slider label in the supplied plan. Preserve both unless the café approves a unified title. Affogato remains included in that group because that is what the plan specifies.

### Copy tone

- Friendly, warm, lightly playful.
- Short and useful; no generic luxury language.
- Examples for editorial copy only (not product descriptions):
  - “Something good is waiting.”
  - “Take a look around. Find your comfort.”
  - “Made for slow days and good company.”
  - “Good sips. Good company.”
- Do not claim awards, discounts, ingredients, dietary information, opening hours, or specific availability without approval.

---

## 6. Mobile-first layout specification

**Primary frame for design:** 390px wide. Validate at approximately **320, 375, 390, and 430px**, then tablet and desktop.

### First viewport priorities

1. Floating/sticky navigation with visible access to the three major menu groups.
2. Small welcome statement (not a huge hero).
3. The start of **Drinks**, ideally including at least the first product photo or a meaningful part of the first slider on common phone heights.

### Layout sketch — first screen

```text
┌──────────────────────────────────────┐
│    [CALLE café] Drinks Snacks Weekend│  sticky, softly rounded
└──────────────────────────────────────┘

  WELCOME TO CALLE
  Something good
  is waiting.
  Take a look around. Find your comfort.

  ─────────────────────────────────

  01 / THE MENU
  Drinks.

  Coffee Based                     ‹ ›
  ┌────────────────────────┐┌───────
  │                        ││
  │  APPROVED PRODUCT PHOTO││ NEXT
  │                        ││ PHOTO
  └────────────────────────┘└───────
  Product Name
  ₱ VERIFIED PRICE ONLY
```

### Spacing guidelines (starting values, refine in Figma)

- Page horizontal gutter: **16–20px** on mobile.
- Spacing from sticky navigation to content: **16–28px**.
- Welcome-to-menu transition: **24–40px**.
- Section heading to first slider: **20–28px**.
- Between slider groups: **40–64px**.
- Main section separation: **64–96px**.
- Image-to-name gap: **10–14px**.
- Name-to-price gap: **4–8px**.
- Overall page container: fluid, without horizontal document overflow.

Avoid blindly applying one large spacing value everywhere. Group information tightly within a card, and give section breaks more breathing room.

### Sticky navigation

- Floating/inset header with a gentle border and subtle shadow, preferably cream or white rather than dark and bulky.
- Make it sticky with a modest top offset; it must not occupy an excessive amount of the screen.
- Show brand + three destinations. On the narrowest screens, use horizontally scrollable links or an accessible compact alternative.
- Provide clear focus/active state, easy tap targets, and `scroll-margin-top` on destinations.
- Avoid having the header scroll horizontally when the user is trying to swipe a product slider below it.

---

## 7. Desktop and tablet layout

Desktop is an adaptation of the mobile system, **not a different homepage concept**.

- Use a centered content area roughly **1120–1200px maximum**, with responsive side padding.
- Keep the same section order, typography identity, and navigation destinations.
- Increase whitespace around main section titles.
- Show more product cards per row within each slider, typically **3–4** depending on actual card widths.
- Do not replace the six sliders with a separate dense product grid unless the scope is explicitly changed.
- Keep image cropping, product labels, and arrow positioning consistent.
- Maintain discoverable arrow controls and keyboard support even when users are not swiping.

### Desktop composition sketch

```text
  ┌──────────────────────────────────────────────────────────┐
  │ CALLE café                   Drinks  Snacks  Weekend    │
  └──────────────────────────────────────────────────────────┘

  WELCOME TO CALLE
  Something good is waiting.

  01 / THE MENU
  DRINKS.

  Coffee Based                                         ‹  ›
  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌──────┐
  │   Photo     │ │   Photo     │ │   Photo     │ │Photo │
  └─────────────┘ └─────────────┘ └─────────────┘ └──────┘
  Name / price    Name / price    Name / price    ...

  Matcha Series                                        ‹  ›
  [same reusable slider]

  Fruit Series                                         ‹  ›
  [same reusable slider]

  Milktea Based                                        ‹  ›
  [same reusable slider]

  02 / A LITTLE SOMETHING TO EAT
  SNACKS.
  [one reusable slider]

  03 / THE WEEKEND
  WEEKEND COCKTAILS.
  [one reusable slider]

  [friendly branded footer]
```

---

## 8. Product card design system

Each card should look like a **photograph with a clear editorial caption**, not a retail checkout tile.

### Required card structure

1. **Product image:** approved, consistent visual framing, no text printed into the photo.
2. **Name:** always shown; use the approved spelling.
3. **Price label:** only if verified; support approved hot/iced or size prices as static text where needed.
4. **Description:** optional and only if verified; keep brief.

### Recommended card styling

- Media shape: **4:5 portrait** for all categories (or choose a consistent 1:1 crop if authentic assets demand it; don't mix ratios arbitrarily within a row).
- Media corners: approximately **12–20px**.
- Surface: photo against a neutral cream/oat background. Avoid strong card border/shadow around every item.
- Labels: align name/price consistently below imagery.
- No “Buy”, “Order”, plus, quantity, cart, ratings, fake discount badges, or clickable action that suggests purchasing.
- Optional tap-to-enlarge: only if fully accessible and it doesn't interrupt swipe navigation.
- Ensure long names wrap gracefully and keep card rows visually stable.

### Product photography direction

- Use **real Calle Café products** or café-approved images at launch.
- One consistent lighting and background treatment per collection, preferably soft light and warm neutral surfaces.
- Photograph drinks upright, with the cup fully in frame; do not crop essential garnishes or tops.
- Give items space around the edges so card cropping stays safe.
- Use consistent export ratios; start with approximately **640×800** for 4:5 card images as a practical working target, then tune quality/weight.
- Use compressed WebP/AVIF/JPEG, reserve width/height or aspect ratio to prevent layout shift, and lazy-load images that are off-screen.
- Do not include product names or prices inside the image file.

**Content policy for missing assets:** In internal design mockups, mark placeholders clearly. Do not publish stock/sample placeholders as if they were Café products. If real content is incomplete, finish/hold that category before launch rather than silently fabricating it.

---

## 9. Slider interaction design

Use **one reusable `ProductSlider` component instantiated six times**. The sliders should function independently.

### Suggested visible slides

| Breakpoint | Visible cards (starting point) | Primary interaction |
| --- | --- | --- |
| Small mobile | ~1.0–1.15 | Touch swipe; partial next card if room allows |
| Standard mobile | ~1.15–1.35 | Touch swipe; next card visibly peeks in |
| Tablet | ~2.0–2.5 | Swipe + arrow buttons |
| Desktop | ~3.0–4.0 | Arrows, mouse/touchpad interaction, keyboard |

### Controls and behavior

- Place category heading and clearly labelled previous/next controls on the same row where possible.
- A portion of the next product card should be visible on mobile so the horizontal interaction is obvious.
- **No autoplay and no infinite loop by default.** People are reading.
- Keep previous/next buttons scoped to each slider so controls cannot move another category.
- Disable or hide controls when the slider has too few items to overflow.
- Support keyboard navigation when focused; provide accessible labels and visible focus styles.
- Prevent page-wide horizontal overflow.
- Use smooth but short transitions; respect `prefers-reduced-motion`.
- If adding an image modal, it should have Escape-to-close, focus management, an obvious Close button, and must not fire unintentionally on swipe.

### Motion language

| Interaction | Treatment |
| --- | --- |
| Initial content appearance | Prefer content visible immediately; very subtle optional fade |
| Anchor link to section | Smooth scroll where user preferences permit; otherwise immediate jump |
| Slider movement | Native-feeling horizontal motion, no elastic theatrics |
| Desktop card hover | Slight visual lift or image emphasis, never a large zoom |
| Buttons | Small color/opacity transitions |
| Footer mascot detail | Static or very subtle one-time treatment |

**No large parallax scenes, GSAP timelines, scroll-jacking, forced loading animation, or continuously moving card rows** in the current menu-only phase.

---

## 10. Section-by-section design

### A. Floating header

**Mood:** Light, calm, reliable.  
**Contents:** Official logo/wordmark and anchors to Drinks, Snacks, Weekend Cocktails.  
**Do:** Slight elevation from the page; compact and reachable.  
**Don't:** Oversized site-navigation bar with unrelated page links.

### B. Compact greeting

**Eyebrow:** `WELCOME TO CALLE`  
**Proposed heading:** `Something good is waiting.`  
**Proposed supporting line:** `Take a look around. Find your comfort.`

These are editable brand-copy suggestions. Keep the greeting short enough that the first product section begins quickly on mobile.

### C. Drinks

**Section index:** `01 / THE MENU`  
**Heading:** `Drinks.`  
**Sliders in order:** Coffee Based → Matcha Series → Fruit Series → Milktea Based.

**Art direction:** Cream ground, espresso text, clean and consistent product photos. Category headings use DM Sans, while the main `Drinks.` heading uses Fraunces.

### D. Snacks

**Section index suggestion:** `02 / A LITTLE SOMETHING TO EAT`  
**Heading:** `Snacks.`  
**One slider:** Churros, Fries, Hash Brown, Nachos, Waffles, Loaded Fries.

**Art direction:** Maintain the same card system; allow natural warm snack colors to provide visual variety. Do not add a second grid or individual feature cards in this phase.

### E. Weekend Cocktails

**Section index suggestion:** `03 / THE WEEKEND`  
**Main heading:** `Weekend Cocktails.`  
**Slider label:** `Weekend Drinks`  
**One slider:** Summer Cocktail, Blueberry Pink Cocktail, Blueberry Peach Cocktail, Affogato, Lychee Rainbow Cocktail.

**Art direction:** Optionally create a single Espresso-toned section as a deliberate visual change. Use high-contrast cream type and maintain photo accessibility. Don't imply serving times or availability beyond what is verified in café content.

### F. Footer

**Proposed close:** `Made for slow days and good company.`  
**Optional details:** Approved social URLs, address, and hours only if supplied/verified.  
**Visual detail:** Small, quiet original cat motif, used as a brand signature.  
**Don't:** Add a contact form or invent business information.

---

## 11. Component and layout inventory

| Component | Responsibility | Key requirements |
| --- | --- | --- |
| `FloatingHeader` | Brand + three top-level anchor links | Compact, sticky, mobile-safe, keyboard focus |
| `WelcomeIntro` | Short greeting | Quick to scan, not a hero block |
| `MenuSectionHeading` | Editorial numbered section opening | Reusable across Drinks / Snacks / Weekend |
| `ProductSlider` | Reusable horizontal carousel | Six independent instances, accessible arrows/swipe |
| `ProductCard` | Image + product metadata | Consistent framing, approved names/prices |
| `CalleFooter` | Sign-off and optional business links | Small footprint, brand personality |

### Optional extras (only if needed)

- `ProductImageDialog` for tap-to-enlarge.
- `SectionJumpNav` enhancement to indicate active section, so long as it does not obscure content.
- Small illustration asset for the cat / hand-drawn marks.

Do not create many different card variants before the core six sliders are visually consistent.

---

## 12. Figma workflow — recommended order

Create Figma designs **before** modifying live page layout. Design from actual content and photos whenever possible.

### Frame set

1. **390×844** — primary mobile design (first viewport).
2. **390px wide, full-page** — all six sliders and section transitions.
3. **320px wide** — smallest practical content stress test.
4. **768px wide** — tablet.
5. **1440px wide** — desktop, centered content within ~1120–1200px.

### Step-by-step

1. **Audit current repo / assets.** Check logo quality, usable fonts, photos, existing components, and existing QR route; don't redesign blindly.
2. **Create color and typography styles.** Add the palette and Fraunces/DM Sans hierarchy.
3. **Design one complete product card.** Test short and long names, optional prices and descriptions, and 4:5 images.
4. **Design one real slider.** Coffee Based is the reference, with touch hint, arrow controls, and label spacing.
5. **Design the first mobile viewport.** Compact navigation, welcome, Drinks heading, first slider.
6. **Expand to the full mobile menu.** Reuse the same slider pattern across all six categories.
7. **Introduce section rhythm.** Strong type, whitespace, optional contrasting Weekend section.
8. **Build tablet and desktop adaptations.** Increase cards visible and whitespace; don't change the information architecture.
9. **Apply brand details sparingly.** Wordmark, cat, optional hand-drawn accents.
10. **Review readability and realism.** Verify product image quality, actual line wrapping, accessible control sizes, and scroll length.

### Useful Figma component variants

- Navigation: default / active / focus.
- Slider arrows: enabled / disabled / hover / focus.
- Product card: with price / without price / long name / with description.
- Section heading: cream section / optional espresso section.

Avoid spending time on complex animations until spacing, imagery, and the menu hierarchy are approved.

---

## 13. Technical handoff: existing application

**Do not scaffold a new app.** Work within the existing Next.js + TypeScript + Tailwind repository, and follow its current file conventions.

| Concern | Decision from implementation plan |
| --- | --- |
| Main route | `/menu` |
| React framework | Existing Next.js App Router |
| Language | TypeScript |
| Styles | Tailwind CSS + shared design tokens |
| Sliders | Swiper React reusable component |
| UI icons | Existing Lucide icon setup |
| Motion | CSS transitions; Swiper movement; no GSAP requirement |
| Menu data | Typed local file such as `src/data/menu.ts` |
| Assets | Local approved photos under `public/images/products/` |
| Hosting | Static export to Cloudflare Pages (`out/`) |
| QR | One stable production `/menu` URL |

### Non-negotiable technical constraints

- Existing root-path QR codes, if already printed, must not break: keep `/` as a working entry to the menu.
- Data and products are static and updated through the repository and redeployments.
- No database, authentication, server actions, runtime API routes, upload handling, backend checkout, or order submissions.
- Keep the final production URL stable after deployments; changes to content do **not** require reprinting the QR code if the destination URL stays the same.
- Optimize product photos and reserve image dimensions to prevent layout shifts.
- Protect current working code with a Git checkpoint/branch before edits.

### Design-to-code sequence

1. Inspect what exists; identify components to preserve, change, or retire.
2. Implement design tokens and typography.
3. Build/reskin floating header and compact welcome.
4. Implement one responsive, accessible `ProductCard`.
5. Implement one reusable `ProductSlider`, then instantiate it six times.
6. Populate category data only with approved café content.
7. Adapt to tablet and desktop.
8. Add small decorative details only after the menu is usable.
9. Verify build, static export, real-device QR behavior, and six independent carousels.

---

## 14. Accessibility and performance review

### Accessibility

- Use semantic headings (`h1`, `h2`, `h3`) in a logical hierarchy.
- Make keyboard focus visible and tab order predictable.
- Ensure navigation and slider buttons have large enough tap areas (aim for **at least 44×44px**).
- Provide useful text alternatives for product photos.
- Do not convey active states using only color.
- Test real foreground/background contrast, especially in the Espresso weekend section.
- Respect `prefers-reduced-motion`.
- Account for the sticky header when scrolling to section anchors.
- Ensure the page remains usable when product descriptions are longer or prices are absent.

### Performance

- The QR menu must be usable on mobile data and modest devices.
- Load the primary menu experience immediately; avoid mandatory entrance motion.
- Compress imagery, use appropriately sized files, lazy-load off-screen images.
- Avoid downloading all original full-resolution posters in the product-slider route.
- Keep animation libraries minimal; do not add GSAP merely for decorative effects.
- Check for layout shifts, horizontal overflow, and accidental nested scrolling.

---

## 15. Visual QA and acceptance checklist

### First-screen UX

- [ ] At 390px, the branded menu is immediately recognizable.
- [ ] The header gives clear access to Drinks, Snacks, Weekend Cocktails.
- [ ] The first category appears quickly; the welcome does not dominate the screen.
- [ ] Text and photo framing are comfortable to read on a real phone.

### Menu structure

- [ ] Exactly four Drinks sliders: Coffee Based, Matcha Series, Fruit Series, Milktea Based.
- [ ] Exactly one Snacks slider, containing all six specified products.
- [ ] Exactly one Weekend Cocktails slider, containing all five specified products.
- [ ] Every slider navigates independently.
- [ ] Product names/photos match café-approved content; only verified prices appear.
- [ ] No cart, ordering, account, or payment controls exist.

### Interaction

- [ ] Swipes work reliably on touch screens.
- [ ] Slider arrow buttons work with mouse and keyboard.
- [ ] Unnecessary arrow controls disappear/disable when content fits.
- [ ] Nav anchors do not hide headings behind the sticky header.
- [ ] No page-wide horizontal scrollbar.
- [ ] Reduced-motion users can browse the entire menu.

### Responsive and technical

- [ ] Reviewed at 320, 375, 390, 430, 768, and 1440px widths.
- [ ] Card image crops are consistent across breakpoints.
- [ ] Long names and absent prices do not break layout.
- [ ] Product photography is optimized.
- [ ] `npm run build` succeeds and static output is generated.
- [ ] `/menu` loads correctly from the deployed stable QR destination.
- [ ] Existing QR destination routes (if any) remain functional.

---

## 16. OpenCode / Claude Code design handoff prompt

Copy this prompt into your coding assistant, alongside this guide and the latest phased implementation plan:

> Review the **existing Calle Café Next.js/TypeScript/Tailwind repository** and the documents `CALLE_CAFE_QR_PRODUCT_SLIDERS_PHASED_PLAN(1).md` and `CALLE_CAFE_COZY_EDITORIAL_QR_MENU_DESIGN_GUIDE.md` before making changes. This is a design refresh for a **single-route, static, mobile-first, view-only QR menu**, **not** a multi-page parallax website or e-commerce store. Preserve useful code and authentic brand assets. Adopt the design concept **“The Neighborhood Menu — Cozy Editorial Minimalism”**: `#F5F0E8` cream background, `#352B26` espresso text, `#80624F` mocha accents, Fraunces editorial headings, DM Sans UI text, subtle oat surfaces, a softly elevated floating sticky header, compact welcome area, generous yet efficient rhythm, photo-led 4:5 product cards, and small respectful cat/illustration details. Use three anchor destinations: Drinks, Snacks, Weekend Cocktails. Build exactly six independently controlled sliders: Coffee Based, Matcha Series, Fruit Series, Milktea Based, Snacks, Weekend Drinks. Snacks contains Churros, Fries, Hash Brown, Nachos, Waffles, Loaded Fries. Weekend Drinks contains Summer Cocktail, Blueberry Pink Cocktail, Blueberry Peach Cocktail, Affogato, Lychee Rainbow Cocktail. **Do not invent drinks lists, prices, images, descriptions, availability, or location details.** Show only approved information and do not publish fake placeholders as products. Use one reusable accessible Swiper component with responsive visible slides, keyboard/touch navigation, no autoplay, and no unwanted horizontal page overflow. No giant hero, GSAP/parallax, poster gallery, cart, checkout, ordering, user account, database, backend, admin panel, contact form, or new app scaffold. First audit the existing components and create a safe Git checkpoint. Implement mobile-first (390px), test 320/375/430px, tablet, and 1440px desktop, respect reduced motion, verify `npm run build`, preserve static export to Cloudflare Pages, and keep `/menu` as the stable QR destination without breaking any earlier printed root links. Report what changed and any content still requiring café approval.

---

## 17. Content still needed from Calle Café

These are **inputs**, not unresolved design choices:

- Approved product names for the four Drinks categories.
- Verified prices, including any relevant hot/iced and size variations.
- Approved individual product photographs or approved image set.
- Final logo/wordmark asset and optional cat illustration suitable for web use.
- Verified opening hours, address, and social links **only if** they will appear in the footer.

The supplied phased plan is the authority for functionality and scope. This guide specifies the visual direction and interaction presentation around that plan.

**Final guiding principle:** **Scan → see the menu → choose a section → swipe products → read names and prices.** Build an experience that feels like Calle Café, not a shopping cart.

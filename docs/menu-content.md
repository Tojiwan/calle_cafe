# Menu content and image handoff

## Source priority

Owner approved Affogato in both Coffee Based and Weekend Cocktails and asked
that prices/sizes come from `public/Menu Reference Price/`. These posters take
priority over conflicting product filenames. For items absent from the posters,
use supplied filename prices and omit unknown sizes. All labels remain editable
in `src/data/menu.ts`; these are display labels, not ordering options.

| Reference image | Information used |
| --- | --- |
| `00dc4c05-b6d2-4060-a9e7-1d426afd6835.jfif` | Six espresso drinks, hot 10 oz / iced 16 oz; Tayger Brawn Sugar and Okinawa iced 16 oz; four Matcha drinks iced 18 oz |
| `44b30459-a14e-4097-8c00-0c0b06b0d40e.jfif` | Four sodas iced 18 oz; fruit milks and Limon Yakult iced 16 oz; Waffles ₱105; Fries ₱135; waffle additions and fries flavors |
| `e370d06e-54ee-48ab-83bd-361f4f2a33aa.jfif` | Four cocktails ₱100 each; Affogato ₱140 |

## Reconciled values

- Eysel Nat Kopi: Hot (10 oz) ₱120 / Iced (16 oz) ₱150.
- Istroberi Soda: ₱80 from the poster, rather than ₱100 in its filename.
- Istroberi Melk and Bluberi Melk: ₱90 from the poster, rather than ₱100 in filenames.
- Affogato: ₱140 in both categories, rather than the coffee image filename's ₱150. No cup size inferred.
- Display `Wayt Moka Latey`, `Eysel Nat Kopi`, and `Bluberi Melk` using poster spellings; image paths retain normalized source filenames.
- Preserve the supplied `Okinawa` name rather than the poster's apparent `Okininawa` typo.
- Fruit teas: iced ₱100 from filenames; sizes absent from these posters.
- Kukis N Krim and Istroberi milktea: iced ₱115 from filenames; sizes absent from these posters.
- Wintimilon appears on the poster but has no supplied product image. It is not added to the approved 37-entry inventory.
- Poster opening hours and availability text are not added to the site; business information can be confirmed separately.

## Remaining content inputs

- Churros, Hash Brown, Nachos, and Loaded Fries prices are absent from the supplied references. Their price labels are omitted.
- Confirm sizes for the four fruit teas, Kukis N Krim, Istroberi milktea, cocktails, and Affogato if sizes should be shown.
- Waffle note is exactly “₱20 for additional toppings.” No assumption about included toppings or a per-topping charge.
- Waffles: Chocolate, Caramel, Strawberry, Matcha syrups; Almond, Oreo, Biscoff, Choco Chips toppings.
- Fries: Cheese, Barbeque, Sour Cream flavors.

## Asset review and preparation

Reviewed all 37 product assets in a contact sheet and inspected their dimensions.
Supplied assets mix illustrations/cutouts with photographic cocktail images.
No product labels or prices were visible baked into the prepared product images.

| Group | Count | Source quality |
| --- | --- | --- |
| Coffee Based | 7 | Six cup images only 37–59 px wide; Affogato 132×132 |
| Matcha Series | 4 | Only 53–61 px wide |
| Fruit Series | 11 | Only 49–71 px wide |
| Milktea Based | 4 | 113–146 px wide |
| Snacks | 6 | 255–303 px wide, mostly landscape illustrations |
| Weekend Cocktails | 5 | 2048×2048 or 2510×1696; suitable for downsizing |

`npm run prepare:images` creates normalized WebP copies under
`public/images/products/<category>/`, plus a 512px brand asset at
`public/images/branding/calle-logo.webp`. It preserves the originals, caps
products at 1200×1500, and never upscales or crops products. The 37 prepared
product files total **740,932 bytes** (about 724 KiB); the five weekend photos
were regenerated at 1200 px from their 2048/2510 px sources. The other 32 files
remain below 400 px wide and need replacement source art.

Use a consistent 4:5 media container with `object-fit: contain` to keep cups and
landscape snacks intact. The file dimensions intentionally retain their original
proportions. For replacements, provide **1200×1500 px, 4:5** drink/snack art
(**1200×1200 px** weekend photos if keeping the current square presentation).
Higher-resolution replacements are required for sharp large cards;
recompression cannot recover missing detail. Original files and price posters
remain in `public/` and therefore in static exports, but product cards must
reference only the optimized image paths.

## Design handoff

No Figma file or approved frames were supplied. The owner subsequently requested
Phase 4–5 implementation, so the supplied design guide was used directly for the
browser implementation. The responsive menu is now available for visual review;
no separate Figma approval is claimed. Image-quality acceptance remains pending.

## Data handoff

`menuCategories` exports exactly six categories with counts **7 / 4 / 11 / 4 / 6 / 5**.
Every card has a name, optimized image path, and alt text. Affogato uses distinct
IDs in its two categories. Missing prices/descriptions remain optional.

`npm run test:menu` validates inventory, unique IDs, real image paths, source
price conflicts, cup sizes, omitted unknown values, and waffle/fries options.
The data now renders through `ProductCard` and six independent `ProductSlider`
instances on both routes. Static-export tests verify all 37 cards and six sliders
exist in the generated HTML. Browser tests cover navigation, independent
interaction, touch targets, deferred images, and accessibility.

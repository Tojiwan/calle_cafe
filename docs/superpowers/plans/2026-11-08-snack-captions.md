# Snack captions implementation plan

**Approved design:** Use current menu values. Snack names and prices share a row, serving quantities sit below, and dip/flavor/syrup/topping groups use readable labels and plain text. Preserve images and sliders.

**Scope:** `menu.ts`, `ProductCard.tsx`, shared CSS, data/browser tests, and content notes. Restore the fourth helper argument as price; use named optional details to prevent positional mistakes. Match asset casing to Git for case-sensitive deployments.

- [x] Pin all snack prices, serving quantities, drink prices, and exact existing asset paths in data tests; reproduce failure.
- [x] Fix data mapping and render the approved caption hierarchy with semantic option groups.
- [x] Update browser assertions and content notes; lint, typecheck, build, 9 data/static/QR tests, and 15 browser tests pass.
- [x] Inspect phone and desktop captions, including long waffle options. No commit, push, or deployment.

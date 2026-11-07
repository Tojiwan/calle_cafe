# Calle Café

Static, view-only QR menu built with Next.js, TypeScript, and Tailwind CSS.
Phase 1 provides a foundation at `/` and `/menu`; approved product content
and the final design follow in later phases. This is not a launch-ready menu.

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

`npm test` checks the generated static routes, so run the build first.
The export is written to `out/`; deploy that folder to static hosting.
`next start` is not used with this static-export application.

See [to-do.md](to-do.md) for progress, remaining content inputs, and manual
Git/GitHub and Cloudflare Pages setup instructions.

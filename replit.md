# Airbnb Listing Clone

A desktop-only Airbnb-style listing experience for a romantic serviced apartment in Candolim, India.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/airbnb-listing/src/App.tsx` — listing page, photo tour, lightbox, calendar, and interaction state.
- `artifacts/airbnb-listing/src/index.css` — visual system and responsive desktop layout styles.
- `artifacts/airbnb-listing/vite.config.ts` — Vite entrypoint and artifact preview configuration.
- `artifacts/api-server` — shared API scaffold; this listing clone does not depend on it.

## Architecture decisions

- The first build is intentionally frontend-only; listing content is local data because no backend or database was requested.
- The secondary section bar uses normal document flow plus CSS sticky positioning; the booking card remains in-flow rather than independently sticky.
- The Photo Tour reuses the listing gallery data and opens the shared Lightbox so gallery behavior stays consistent across views.
- Calendar state is lifted to the listing page so selected dates update the in-page summary, booking card, and compact sticky-nav price.

## Product

- Browse a long-form property listing with a 5-image hero gallery.
- Navigate Photos, Amenities, Reviews, and Location with smooth scrolling and active-section sync.
- Review amenities, sleeping arrangements, availability, rating breakdowns, reviews, location, host details, and nearby stays.
- Open a dedicated Photo Tour view and browse photos in an accessible Lightbox.
- Select or clear a date range and see the nights and price summary update.

## User preferences

- Desktop-only scope; mobile and tablet layouts are intentionally out of scope for the current product.

## Gotchas

- The app is served by the managed `artifacts/airbnb-listing: web` workflow and requires workflow-provided `PORT` and `BASE_PATH`.
- Reference photos were not supplied as reusable assets, so the UI uses original/licensed substitute photo URLs while preserving the specified composition.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details

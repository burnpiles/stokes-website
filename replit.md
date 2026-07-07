# Stokes Twins

Marketing site for the Stokes Twins creator studio, fully editable through a password-protected `/admin` CMS backed by a database.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `PROD_URL=https://www.stokestwins.com pnpm --filter @workspace/scripts run push-content-to-prod` — overwrite ALL live-site content with dev content (backs up prior live content to `scripts/backups/` first; never point it at a `.replit.dev` domain)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/stokes-twins/` — public React+Vite site + `/admin` CMS UI (`src/pages/AdminPage.tsx`, editors in `src/components/admin/`)
- `lib/db/src/schema/` — Drizzle tables (source of truth for content model); `lib/db/src/seed-data.ts` — seed values
- `lib/api-spec/openapi.yaml` — API contract (source of truth); codegen → `lib/api-zod` + `lib/api-client-react`
- `artifacts/api-server/` — Express routes (content aggregate, admin auth + CRUD, storage)
- `artifacts/stokes-twins/src/lib/content.ts` — public defaults merged over fetched content so the site never renders empty

## Architecture decisions

- Settings is a singleton `jsonb` row (id=1); all other content is normalized tables. Public site reads one aggregate `GET /api/content`.
- Admin auth is a simple password compared to the `ADMIN_PASSWORD` secret, issuing a signed httpOnly cookie (SESSION_SECRET). No user accounts.
- Contract-first: edit `openapi.yaml`, then run codegen. Server validates with `@workspace/api-zod`; client uses generated React Query hooks.
- The site reads live DB content, so changing only `content.ts` defaults or `seed-data.ts` will NOT change a seeded site — update the DB too.

## Product

- Public marketing site (hero, stats, YouTube counter, channels, audience demographics, partnerships, careers).
- Public marketing site also includes a Press section (section 06, between the Partner CTA and Careers teaser) with linked press cards; images live in `artifacts/stokes-twins/public/press/`.
- `/admin` CMS: log in with the admin password, then edit every section, manage list resources (stats, platforms, videos, shorts, jobs, brands, press, demographics), and upload media.
- Section 04 audience data is behind a password gate (blurred overlay, `POST /api/data/unlock`). Password = `DATA_PASSWORD` env var if set, else falls back to `ADMIN_PASSWORD`. Unlock persists per browser tab (sessionStorage). It's a visual gate — the data is still in `GET /api/content`.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Video/short view counts are LIVE: `GET /api/content` overlays real YouTube Data API counts (via the Replit YouTube connector, `artifacts/api-server/src/lib/youtube.ts`, 5-min cache) onto `videos[].views`/`shorts[].views`. The DB `views` values are only a fallback if the API is unavailable. Requires the YouTube connection to stay authorized.

- The YouTube counter animates from `youtubeCounter.base` up to `target` at `perMinute`; keep `target` well above `base` so it keeps climbing.
- Live content lives in the DB. Editing `content.ts`/`seed-data.ts` alone won't change an already-seeded site — update the `settings`/content rows directly or via `/admin`.
- `ADMIN_PASSWORD` and `SESSION_SECRET` must be set; restart the api-server workflow after adding/changing them.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details

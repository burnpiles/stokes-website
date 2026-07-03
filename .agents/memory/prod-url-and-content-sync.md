---
name: Production URL & content sync
description: How to find the real live-site URL and push dev content to production for this project.
---

## Rule
Never use `REPLIT_DOMAINS` / `REPLIT_DEV_DOMAIN` to reach the published site — inside the dev container they hold the `.replit.dev` development preview domain. Use `getDeploymentInfo()` (deployment skill callback) to get the real production URL.

**Why:** A content push once silently targeted the dev site because `REPLIT_DOMAINS` was assumed to be the prod domain. Live site is `https://stokesuniverse.com` (also `stwins.replit.app`).

**How to apply:** Any time you curl/patch the live site or need its URL, call `getDeploymentInfo()` first. The sync script refuses `.replit.dev` hosts as a guard.

## Content sync dev → live
- Publish only ships code/schema; content rows (videos, jobs, etc.) live in a separate prod DB. Prod DB is read-only to the agent — write via the live site's admin API instead (login `POST /api/admin/login` with `ADMIN_PASSWORD`, signed cookie).
- On-demand sync: `PROD_URL=https://stokesuniverse.com pnpm --filter @workspace/scripts run push-content-to-prod` — destructive (overwrites all live content), snapshots prior live content to `scripts/backups/` first.
- User accepted that running the sync wipes any edits made directly on live `/admin`.

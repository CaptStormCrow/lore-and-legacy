# DEVLOG.md
# Lore & Legacy — Engineering Log
# Maintained by: Claude Code

---

## Session 2 — 2026-05-22

**Mission:** Get L&L deployed to Vercel with a green build.

**Result:** ✅ Live at https://lore-and-legacy.vercel.app

---

### What I did, in order:

**1. Read CLAUDE.md and DECISIONS.md**
Full briefing read. Session objective understood: deploy to Vercel, green build, live URL.

**2. Audited all process.env references**
Grepped every `process.env.*` call across `src/`:
- `NEXT_PUBLIC_SUPABASE_URL` — client.ts, server.ts (build-time for NEXT_PUBLIC_*)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — client.ts (build-time)
- `NEXT_PUBLIC_URL` — operator/route.ts, subscribe/route.ts, portal/route.ts
- `SUPABASE_SERVICE_ROLE_KEY` — server.ts (runtime only)
- `ANTHROPIC_API_KEY` — anthropic.ts (runtime only)
- `STRIPE_SECRET_KEY` — stripe.ts (runtime only)
- `STRIPE_WEBHOOK_SECRET` — webhooks/stripe/route.ts (runtime only)
- `STRIPE_PRICE_*` — subscribe/route.ts (was module-level, moved inside handler)
- `RESEND_API_KEY` — resend.ts (runtime only)
- `RESEND_FROM_EMAIL` — operator/route.ts (runtime only)
- `CRON_SECRET` — operator/route.ts (runtime only)

**3. Wrote BLOCKED.md**
Full env var checklist with exact variable names, where to get each value, and a post-deploy testing checklist. Separated "set immediately" (safe public values) from "secrets needed for runtime."

**4. Build hardening — 4 changes to ensure build passes with missing secrets:**

a) **`src/app/api/subscribe/route.ts`** — Moved `PRICE_MAP` from module level into the POST handler body. Module-level `process.env` access is evaluated at bundle time; keeping it inside the handler ensures it only runs at request time.

b) **`src/app/worlds/[share_token]/page.tsx`** — Added `export const dynamic = 'force-dynamic'`. This page uses `createServiceClient()` which requires the service role key. Without `force-dynamic`, Next.js would attempt to statically pre-render the page during build, which would fail with a missing key error.

c) **`src/lib/supabase/server.ts`** — Added explicit guard in `createServiceClient()`: throws a clear error message if `NEXT_PUBLIC_SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY` is missing, rather than passing `undefined` to the Supabase client (which throws a cryptic URL parse error).

d) **`src/lib/supabase/client.ts`** — Added fallback placeholders for `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. The `createBrowserClient` call runs server-side during SSR of client components; without real values it would throw a URL validation error and fail the build.

**5. Verified build passes locally**
`npm run build` via junction path — ✅ clean, 0 errors, same route table as before.

**6. Committed hardening changes + BLOCKED.md**
Pushed to GitHub: https://github.com/CaptStormCrow/lore-and-legacy

**7. Installed Vercel CLI**
`npm install -g vercel` — installed v54.4.1

**8. Checked Vercel auth**
Already logged in as `kpbond-8688` (team: `kys-projects-0ba7e891`).

**9. Linked project to Vercel**
`vercel link --project lore-and-legacy --scope kys-projects-0ba7e891 --yes`
Had to run from real path (not junction) — Vercel CLI treats Windows junction as a file.
Project linked: kys-projects-0ba7e891/lore-and-legacy

**10. Set safe env vars in Vercel (production)**
- `NEXT_PUBLIC_SUPABASE_URL=https://pcxjdutgojfuzkjtvsta.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ZuayYJel4GAk7Of_lx8C0g_XG_Wu57o`
- `RESEND_FROM_EMAIL=worlds@loreandlegacy.com`
- `NEXT_PUBLIC_URL=https://lore-and-legacy.vercel.app`

**11. Deployed to Vercel production**
`vercel --prod --yes` from real directory path.
Build completed in 41s on iad1 (Washington, D.C.)
No errors. All 11 API routes dynamic. All pages built.

**12. Live URL confirmed**
- Production: https://lore-and-legacy.vercel.app
- Inspect: https://vercel.com/kys-projects-0ba7e891/lore-and-legacy

---

### Known issues / what's not working yet (runtime, not build):

All of these are runtime failures, NOT build failures. The site loads. These fail because secrets aren't set yet.

- `/api/generate` → 500 (ANTHROPIC_API_KEY and SUPABASE_SERVICE_ROLE_KEY missing)
- `/api/subscribe` → 500 (STRIPE_SECRET_KEY missing)
- `/api/status` → 500 (SUPABASE_SERVICE_ROLE_KEY missing)
- `/api/webhooks/stripe` → 400 (STRIPE_WEBHOOK_SECRET missing)
- `/api/operator` → 403 (CRON_SECRET missing — actually returns 403 which is correct behavior)
- Magic link email → may work (NEXT_PUBLIC_SUPABASE_URL and ANON_KEY are set)

### Workarounds applied permanently:

- Vercel CLI must always be run from `C:\Users\kpbon\WebsiteApps\Lore & Legacy` (real path), NOT from the `lore-legacy` junction — Vercel CLI resolves junctions as files.
- For npm/build commands, the junction path still works fine.

---

## Session 1 — 2026-05-22

**Mission:** Initialize repo, scaffold Next.js, build all API routes and pages.

**Result:** ✅ Complete. See STATUS.md for full checklist.

Build passed. 50 files committed. GitHub: https://github.com/CaptStormCrow/lore-and-legacy

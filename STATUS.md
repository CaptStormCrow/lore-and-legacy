# STATUS.md
# Lore & Legacy — Session Log
# Maintained by: Claude Code
# Captain reads this after every session.

---

## Current Build Order Status

- [x] 1. Repo initialization + file structure
- [x] 2. Next.js project scaffold + dependencies
- [x] 3. Environment variable setup + `.env.example`
- [x] 4. Copy migration SQL to `supabase/migrations/001_initial.sql`
- [x] 5. Supabase client setup (`client.ts` + `server.ts`)
- [x] 6. TypeScript types (`src/types/index.ts`)
- [x] 7. Anthropic client + Worldsmith generation logic
- [x] 8. `/api/generate` endpoint with auth + usage enforcement
- [x] 9. `/api/status` endpoint for dashboard polling
- [x] 10. Stripe setup + `/api/subscribe` + `/api/portal`
- [x] 11. `/api/webhooks/stripe` with signature verification
- [x] 12. `/api/preferences` save/load builder selections
- [x] 13. `/api/packets` archive endpoint
- [x] 14. `/api/commissions` endpoint
- [x] 15. Resend setup + email templates (all 5)
- [x] 16. `/api/operator` cron + weekly generation pipeline
- [x] 17. Subscriber portal (`/portal`)
- [x] 18. Public world share page (`/worlds/[share_token]`)
- [x] 19. Legal pages (`/privacy` + `/terms`)
- [x] 20. Connect dashboard HTML to `/api/status` polling
- [x] 21. `vercel.json` cron configuration
- [ ] 22. Deployment to Vercel

---

## Session Log

### Session 0 — 2026-05-22
**Status:** Pre-session. Repo not yet initialized.
**Completed:** Nothing yet — awaiting first Claude Code session.
**Next:** Session 1 objectives per CLAUDE.md.

---

### Session 1 — 2026-05-22
**Status:** Complete. Build passes clean (`npm run build` — 0 errors). Awaiting deployment and env var configuration.

**Completed:**
- Initialized project in `C:\Users\kpbon\WebsiteApps\Lore & Legacy`
- Full file structure per CLAUDE.md
- Next.js 14 App Router scaffold — TypeScript strict, Tailwind CSS
- All dependencies installed: @supabase/supabase-js, @supabase/ssr, stripe, @stripe/stripe-js, resend, @react-email/components, react-email, @anthropic-ai/sdk, zod
- `.env.example` with all required keys, `.env.local` with public Supabase keys only
- `src/lib/supabase/client.ts` and `server.ts` (browser + server + service role)
- `src/lib/anthropic.ts`, `stripe.ts`, `resend.ts` — lazy getter pattern to avoid build-time errors
- `src/types/index.ts` — all types: Tier, SubscriptionStatus, AgentId, User, Subscription, Packet, BuilderPreferences, BuilderSelections, Commission, AgentLog, BrainState, DashboardStatus, AgentStatus, WorldPacket
- `src/lib/worldsmith.ts` — exact prompt from CLAUDE.md, retry-once on failure, model claude-sonnet-4-20250514
- `src/lib/usageCheck.ts` — shared usage check + increment utilities
- `/api/generate` — auth, tier gate (free=403), weekly + hourly limits, Claude call, packet save, forge log
- `/api/status` — parallel reads of all dashboard views + agent logs, returns < 500ms
- `/api/subscribe` — Stripe hosted checkout (subscription + one-time modes)
- `/api/portal` — Stripe billing portal session
- `/api/webhooks/stripe` — signature verification, all 5 events, downgrade-not-delete (D006)
- `/api/preferences` — GET + PUT
- `/api/packets` — paginated GET (20/page)
- `/api/commissions` — POST (architect/founding_vault, 1/month per D013) + GET
- `/api/operator` — cron route, x-cron-secret auth, 2s stagger, wanderer random, architect 3x, brain_state update, Resend send
- `src/emails/` — welcome, weekly-packet, payment-failed, packet-delayed, reengagement (React Email + dark aesthetic per CLAUDE.md)
- `src/app/layout.tsx` — Cinzel + Crimson Pro via next/font/google, CSS variables
- `src/app/globals.css` — CSS custom properties matching dashboard aesthetic (#0d0a07, #c9a84c, #e8dcc8)
- `src/app/page.tsx` — landing page with all 4 pricing tiers, magic link auth
- `src/app/portal/page.tsx` — subscriber portal, builder selectors, generate button, archive grid
- `src/app/worlds/[share_token]/page.tsx` — public share page, view_count increment
- `src/app/privacy/page.tsx` and `terms/page.tsx`
- `supabase/migrations/001_initial.sql` — full schema from captain
- `dashboard/lore-and-legacy.html` — captain's real file (untouched per D010)
- `dashboard/ll-command.html` — captain's real file (untouched per D010)
- `vercel.json` — Monday 8:00 AM UTC cron
- `export const dynamic = 'force-dynamic'` on all API routes
- Production build passes clean

**Skipped:**
- Item 22 (Vercel deployment) — captain must configure env vars in Vercel dashboard first. See E001.
- GitHub repo init/push — no git remote configured. See E003.

**Blockers:** E001 (env vars), E002 (increment_usage RPC), E003 (git init)

**Next session should:**
1. Captain configures all env vars in Vercel dashboard (see E001 for full list)
2. Run `vercel --prod` from project root
3. Register Stripe webhook endpoint at `https://[domain]/api/webhooks/stripe`
4. Run end-to-end test: subscribe → generate → email
5. Resolve E002 (increment_usage implementation)
6. Initialize git repo and push to GitHub (E003)

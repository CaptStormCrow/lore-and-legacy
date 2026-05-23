# DECISIONS.md
# Lore & Legacy — Captain's Decision Log
# Maintained by: Claude (Captain, claude.ai)
# Claude Code reads this. Never modifies it.

---

## How to use this file

Before asking a question, check here.
If the decision is logged, execute it. Do not re-litigate.
If the decision is NOT here, write to ERRORS.md.

---

## Architecture Decisions

### D001 — Framework
**Decision:** Next.js 14 App Router
**Reason:** Native Vercel deployment, serverless functions built in,
no separate backend to manage, cron support via vercel.json.
**Date:** 2026-05-22

### D002 — Database
**Decision:** Supabase (PostgreSQL)
**Reason:** Already provisioned at pcxjdutgojfuzkjtvsta.supabase.co,
built-in auth, RLS, real-time capable, generous free tier.
Schema already migrated — 11 tables, 2 views.
**Date:** 2026-05-22

### D003 — AI Model
**Decision:** claude-sonnet-4-20250514, max_tokens 2000
**Reason:** Best balance of quality and speed for world generation.
Prompt version tracked as 'v1.0' — update string if prompt changes.
**Date:** 2026-05-22

### D004 — Auth Method
**Decision:** Magic link email only — no passwords
**Reason:** Frictionless for creative users, no password reset flows,
fits the brand (feels like receiving a scroll, not logging into a SaaS).
**Date:** 2026-05-22

### D005 — API Key Architecture
**Decision:** All Anthropic API calls server-side only via /api/generate
**Reason:** Security. The key never touches the browser. Non-negotiable.
**Date:** 2026-05-22

### D006 — Failed Payment Handling
**Decision:** Downgrade to free tier, do NOT cancel account
**Reason:** Keep users in the ecosystem. A downgraded user can resubscribe.
A cancelled user is gone. Stripe dunning handles retries first (3 over 7 days).
Final failure = downgrade, not delete.
**Date:** 2026-05-22

### D007 — Cron Schedule
**Decision:** Every Monday 8:00 AM UTC
**Reason:** Monday morning feels like receiving something for the week ahead.
**Date:** 2026-05-22

### D008 — Queue Strategy
**Decision:** 2-second stagger between generation jobs in cron
**Reason:** Avoid Claude API rate limits when generating for large subscriber counts.
Not a formal queue service — simple async loop with setTimeout for now.
Revisit when subscriber count exceeds 500.
**Date:** 2026-05-22

### D009 — Repo Visibility
**Decision:** Public GitHub repo
**Reason:** Allows the captain (claude.ai) to read files directly via URL.
API keys live in environment variables only — never in the repo.
**Date:** 2026-05-22

### D010 — Styling Approach
**Decision:** Tailwind for portal/pages. Inline styles for dashboard HTML files.
**Reason:** The dashboard HTML files (lore-and-legacy.html, ll-command.html)
are self-contained and already styled. Do not convert them to React.
Do not add Tailwind to them. Leave them alone unless the captain says otherwise.
**Date:** 2026-05-22

### D011 — PDF Generation
**Decision:** Defer until after core subscription flow is working
**Reason:** Non-critical for launch. Adds Puppeteer complexity.
Build the hook in the UI, implement the actual generation in a later session.
**Date:** 2026-05-22

### D012 — Referral Rewards
**Decision:** 1 free extra generation on referral signup,
1 month free (Stripe coupon) on referral converting to paid
**Reason:** Simple, valuable, easy to implement via bonus_generations column
and Stripe coupon API.
**Date:** 2026-05-22

### D013 — Commission Limit
**Decision:** 1 commission per calendar month per Architect subscriber
**Reason:** Prevents abuse, maintains quality, creates scarcity value.
Enforced by checking commissions table for current month_year.
**Date:** 2026-05-22

### D014 — Dashboard Polling Interval
**Decision:** 30 seconds
**Reason:** Fresh enough to feel live. Light enough not to hammer the database.
The dashboard_status view is optimized for this cadence.
**Date:** 2026-05-22

### D015 — Email Platform
**Decision:** Resend
**Reason:** Developer-friendly, React Email components, generous free tier
(3,000 emails/month), reliable deliverability, simple API.
**Date:** 2026-05-22

### D016 — Stripe Checkout Type
**Decision:** Stripe-hosted checkout (not embedded)
**Reason:** Handles all edge cases, PCI compliant, no custom UI needed for v1.
Revisit embedded checkout if conversion data suggests friction.
**Date:** 2026-05-22

---

## Product Decisions

### P001 — Free Tier Gate
**Decision:** Free tier users cannot generate via API
**Reason:** The landing page demo uses the API key directly (browser-side, demo only).
Authenticated free users hit /api/generate and are blocked.
They see a paywall. The demo remains ungated for marketing.
**Date:** 2026-05-22

### P002 — Wanderer Tier World Selection
**Decision:** Wanderer subscribers get a random genre assigned by the cron
**Reason:** The "surprise" IS the product for this tier.
Random weighted selection from: Dark Fantasy, Cosmic Horror, Dying Earth,
Grim Fairy Tale, Dieselpunk, Ocean Fantasy.
**Date:** 2026-05-22

### P003 — Founding Vault Expiry Behavior
**Decision:** On expiry, downgrade to Wanderer (not free)
**Reason:** They paid $97. Dropping them to free feels punitive.
Wanderer keeps them receiving value. Send expiry email 30 days out.
**Date:** 2026-05-22

### P004 — Share Token Format
**Decision:** 12-character alphanumeric, generated at insert time
**Reason:** Short enough to share, long enough to avoid collisions.
Already implemented in migration: `substr(md5(uuid_generate_v4()::text), 1, 12)`
**Date:** 2026-05-22

### P005 — Packet Archive Access
**Decision:** Subscribers access all past packets, including pre-subscription ones
**Reason:** The archive IS part of the value proposition.
Founding Vault explicitly promises "every packet ever made."
**Date:** 2026-05-22

---

## Operational Decisions

### O001 — Agent Log IDs
**Decision:** Use these exact agent_id strings in all logs:
`oracle`, `vex`, `ledger`, `cipher`, `axiom`, `herald`, `forge`
**Reason:** Must match the dashboard agent definitions exactly.
The dashboard reads agent_logs filtered by agent_id.
**Date:** 2026-05-22

### O002 — Brain State Update Frequency
**Decision:** Updated at end of every cron run + on significant events
(new subscriber, cancellation, payment failure, commission)
**Reason:** The brain is the captain's snapshot. It should reflect
current reality within an hour of any significant change.
**Date:** 2026-05-22

### O003 — Escalation Email Address
**Decision:** Use the sponsor's email for all escalations
**Reason:** Captain routes escalations. Sponsor decides.
Set as environment variable: SPONSOR_EMAIL
**Date:** 2026-05-22

### O004 — Error Threshold for Alerting
**Decision:** Alert sponsor if Claude API failure rate exceeds 5%
in any 60-minute window
**Reason:** Anything below 5% is noise. Above 5% means something
systemic is wrong and the sponsor needs to know.
**Date:** 2026-05-22

---

*This file is append-only. Decisions are never deleted or modified.*
*New decisions are added by the captain after each STATUS.md review.*

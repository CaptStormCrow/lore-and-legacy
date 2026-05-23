# CLAUDE.md
# Lore & Legacy — Master Briefing
# Maintained by: Claude (Captain, claude.ai)
# Read this before touching anything.

---

## WHO YOU ARE

You are Claude Code — the implementation engine for Lore & Legacy.
You build. You do not make architectural decisions.
When you hit a decision point, you write it to ERRORS.md and keep building around it.
You do not guess on architecture. You do not invent patterns not described here.
You build exactly what is specified, log what you skip, and report clearly.

Your counterpart is Claude (claude.ai) — the captain. All decisions come from there,
delivered via updates to this file. Check DECISIONS.md before asking anything —
it may already be answered.

---

## WHAT WE ARE BUILDING

**Lore & Legacy** — a world-building subscription service.

Every week, subscribers receive a "World Packet" — a fully cohesive fictional world
fragment containing: regional portrait, three factions, one mystery hook, five NPC seeds,
one artifact, and a tone/aesthetic reference.

Three subscription tiers:
- **Wanderer** — $9/mo — 1 world/week, Worldsmith curates everything
- **Cartographer** — $19/mo — 1 world/week, subscriber controls world builder
- **Architect** — $29/mo — 3 worlds/week, full builder control
- **Founding Vault** — $97 one-time — Architect access for 12 months

The product is already demonstrated at `/dashboard/lore-and-legacy.html`.
The command center dashboard is at `/dashboard/ll-command.html`.
Match the visual aesthetic of these files exactly in any new pages.

---

## REPOSITORY STRUCTURE

Initialize exactly this structure:

```
lore-and-legacy/
├── CLAUDE.md              ← this file (never modify without captain approval)
├── STATUS.md              ← you write this after every session
├── DECISIONS.md           ← captain's decision log (never modify)
├── ERRORS.md              ← you write blockers/questions here
│
├── dashboard/
│   ├── lore-and-legacy.html    ← landing page (already built)
│   └── ll-command.html         ← command dashboard (already built)
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── generate/
│   │   │   │   └── route.ts        ← world generation endpoint
│   │   │   ├── webhooks/
│   │   │   │   └── stripe/
│   │   │   │       └── route.ts    ← stripe webhook handler
│   │   │   ├── subscribe/
│   │   │   │   └── route.ts        ← create stripe checkout
│   │   │   ├── portal/
│   │   │   │   └── route.ts        ← stripe customer portal
│   │   │   ├── packets/
│   │   │   │   └── route.ts        ← packet archive
│   │   │   ├── preferences/
│   │   │   │   └── route.ts        ← builder preferences
│   │   │   ├── commissions/
│   │   │   │   └── route.ts        ← commission requests
│   │   │   ├── status/
│   │   │   │   └── route.ts        ← dashboard polling endpoint
│   │   │   └── operator/
│   │   │       └── route.ts        ← claude operator cron
│   │   ├── portal/
│   │   │   └── page.tsx            ← subscriber portal
│   │   ├── worlds/
│   │   │   └── [share_token]/
│   │   │       └── page.tsx        ← public world share page
│   │   ├── privacy/
│   │   │   └── page.tsx
│   │   ├── terms/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts           ← browser supabase client
│   │   │   └── server.ts           ← server supabase client
│   │   ├── stripe.ts               ← stripe instance
│   │   ├── resend.ts               ← resend instance
│   │   ├── anthropic.ts            ← anthropic client
│   │   └── worldsmith.ts           ← world generation logic
│   │
│   ├── emails/
│   │   ├── welcome.tsx
│   │   ├── weekly-packet.tsx
│   │   ├── payment-failed.tsx
│   │   ├── packet-delayed.tsx
│   │   └── reengagement.tsx
│   │
│   └── types/
│       └── index.ts                ← shared TypeScript types
│
├── supabase/
│   └── migrations/
│       └── 001_initial.sql         ← the migration we already ran
│
├── public/
│   └── fonts/
│
├── vercel.json                     ← cron configuration
├── next.config.ts
├── package.json
├── tsconfig.json
└── .env.example                    ← template, never the real keys
```

---

## TECH STACK

- **Framework:** Next.js 14 App Router
- **Language:** TypeScript — strict mode, no `any`
- **Database:** Supabase (PostgreSQL + Auth + Storage)
- **Payments:** Stripe
- **Email:** Resend
- **AI:** Anthropic Claude API (claude-sonnet-4-20250514)
- **Deployment:** Vercel
- **Styling:** Tailwind CSS for portal/pages only
  (the HTML dashboard files use their own inline styles — do not touch them)

---

## ENVIRONMENT VARIABLES

Required in `.env.local` (never commit):

```
ANTHROPIC_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=https://pcxjdutgojfuzkjtvsta.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ZuayYJel4GAk7Of_lx8C0g_XG_Wu57o
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_WANDERER=
STRIPE_PRICE_CARTOGRAPHER=
STRIPE_PRICE_ARCHITECT=
STRIPE_PRICE_FOUNDING_VAULT=
RESEND_API_KEY=
RESEND_FROM_EMAIL=worlds@loreandlegacy.com
NEXT_PUBLIC_URL=https://loreandlegacy.com
CRON_SECRET=
```

Create `.env.example` with these keys but empty values.
Never commit `.env.local`.

---

## DATABASE SCHEMA

Already migrated to Supabase. Tables:
`users`, `subscriptions`, `packets`, `usage_tracking`,
`builder_preferences`, `commissions`, `referrals`,
`agent_logs`, `brain_state`, `analytics_events`, `email_captures`

Views: `dashboard_status`, `agent_status`

Full schema is in `supabase/migrations/001_initial.sql`.
Do not create new tables without captain approval.
Do not modify existing tables without captain approval.
If you need a schema change, write it to ERRORS.md.

---

## CRITICAL ARCHITECTURE RULES

### 1. API Key Security
The `ANTHROPIC_API_KEY` NEVER touches the browser.
All Claude API calls go through `/api/generate` server-side only.
If you find yourself putting the key in client code, stop and write to ERRORS.md.

### 2. Auth Pattern
Use Supabase Auth throughout.
Magic link email — no passwords.
Server components use `src/lib/supabase/server.ts`.
Client components use `src/lib/supabase/client.ts`.
Never mix them.

### 3. Stripe Webhook Verification
Always verify Stripe webhook signatures.
Reject immediately with 400 if signature invalid.
Never process a webhook event without verification.

### 4. Usage Enforcement
Before every generation, check:
- User is authenticated
- User tier allows generation (free = blocked)
- Weekly usage count is under tier limit
  (wanderer: 1, cartographer: 1, architect: 3)
- Rate limit: max 10 requests/hour per user
Write usage check as a shared utility — do not inline it.

### 5. Error Handling
Never let a Claude API failure silently fail a subscriber.
On failure: retry once after 2 seconds.
On second failure: return 503 with user-friendly message.
Log every failure to `agent_logs` table with agent_id='forge'.

### 6. Agent Logging
Every significant operation writes to `agent_logs`.
Format:
```typescript
await supabase.from('agent_logs').insert({
  agent_id: 'herald', // or ledger, cipher, axiom, forge, oracle, vex
  level: 'success',   // info | success | warning | error
  message: 'Weekly packet sent to 47 subscribers',
  metadata: { count: 47, duration_ms: 3200 }
});
```
This is what makes the dashboard real. Do not skip logging.

### 7. Dashboard Status Endpoint
`/api/status` is polled by the command dashboard every 30 seconds.
It must return in under 500ms.
It reads from the `dashboard_status` view and `agent_status` view.
It also reads the last 5 entries from `agent_logs` per agent.
Cache nothing — the views are fast enough.

---

## THE WORLDSMITH PROMPT

Use exactly this prompt structure for world generation.
Do not modify it without captain approval.

```typescript
const prompt = `You are the Worldsmith. Generate a World Packet. ${brief}

CRITICAL: Return ONLY raw valid JSON. No markdown. No backticks. 
No preamble. JSON must be complete and properly closed. 
Keep ALL string values concise — max 2 sentences each.

{"worldName":"striking region name","tagline":"one evocative sentence under 10 words",
"regionalPortrait":"2 vivid atmospheric sentences with sensory detail.",
"factions":[
  {"name":"faction name","description":"2 sentences: who they are and their hidden tension."},
  {"name":"faction name","description":"2 sentences."},
  {"name":"faction name","description":"2 sentences."}
],
"mysteryHook":"2 strange unanswered sentences that haunt the world.",
"npcs":[
  {"name":"Full Name","seed":"8-word personality"},
  {"name":"Full Name","seed":"8-word personality"},
  {"name":"Full Name","seed":"8-word personality"},
  {"name":"Full Name","seed":"8-word personality"},
  {"name":"Full Name","seed":"8-word personality"}
],
"artifactName":"name",
"artifactDescription":"2 sentences: appearance and one mechanical suggestion.",
"toneAesthetic":"2 sentences: mood and 2 real-world influences."}`;
```

Model: `claude-sonnet-4-20250514`
Max tokens: `2000`
Store `prompt_version: 'v1.0'` with every packet.

---

## WEEKLY CRON SPECIFICATION

Fires every Monday at 8:00 AM UTC.
Configured in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/operator",
      "schedule": "0 8 * * 1"
    }
  ]
}
```

The operator route:
1. Verifies `CRON_SECRET` header
2. Reads brain state from Supabase
3. Pulls all active subscribers
4. Builds generation queue with 2-second stagger between jobs
5. For each subscriber:
   - Wanderer: random genre, generate, send via Resend
   - Cartographer: load preferences, generate, send
   - Architect: load preferences, generate 3x, send all
6. On any failure: log to agent_logs, add to retry queue
7. Updates brain_state with results
8. Sends daily digest to sponsor email

---

## EMAIL AESTHETIC

All emails match the site: dark background, gold accents, Cinzel font.
Use Resend + React Email components.
Base template background: `#0d0a07`
Primary accent: `#c9a84c`
Body font: Crimson Pro (via Google Fonts import)
Header font: Cinzel (via Google Fonts import)
Max width: 600px, mobile responsive.

---

## STRIPE PRODUCTS TO CREATE

Create these in Stripe dashboard before building checkout:
- Wanderer: $9/mo recurring → store price ID as `STRIPE_PRICE_WANDERER`
- Cartographer: $19/mo recurring → store as `STRIPE_PRICE_CARTOGRAPHER`
- Architect: $29/mo recurring → store as `STRIPE_PRICE_ARCHITECT`
- Founding Vault: $97 one-time → store as `STRIPE_PRICE_FOUNDING_VAULT`

Webhook events to handle:
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_failed`
- `customer.subscription.paused`

---

## BUILD ORDER

Execute in this exact sequence. Do not skip ahead.
Check off in STATUS.md as each is completed.

- [ ] 1. Repo initialization + file structure
- [ ] 2. Next.js project scaffold + dependencies
- [ ] 3. Environment variable setup + `.env.example`
- [ ] 4. Copy migration SQL to `supabase/migrations/001_initial.sql`
- [ ] 5. Supabase client setup (`client.ts` + `server.ts`)
- [ ] 6. TypeScript types (`src/types/index.ts`)
- [ ] 7. Anthropic client + Worldsmith generation logic
- [ ] 8. `/api/generate` endpoint with auth + usage enforcement
- [ ] 9. `/api/status` endpoint for dashboard polling
- [ ] 10. Stripe setup + `/api/subscribe` + `/api/portal`
- [ ] 11. `/api/webhooks/stripe` with signature verification
- [ ] 12. `/api/preferences` save/load builder selections
- [ ] 13. `/api/packets` archive endpoint
- [ ] 14. `/api/commissions` endpoint
- [ ] 15. Resend setup + email templates (all 5)
- [ ] 16. `/api/operator` cron + weekly generation pipeline
- [ ] 17. Subscriber portal (`/portal`)
- [ ] 18. Public world share page (`/worlds/[share_token]`)
- [ ] 19. Legal pages (`/privacy` + `/terms`)
- [ ] 20. Connect dashboard HTML to `/api/status` polling
- [ ] 21. `vercel.json` cron configuration
- [ ] 22. Deployment to Vercel

---

## SESSION PROTOCOL

At the END of every session you MUST:

1. Update `STATUS.md` with:
   - What you completed (check off build order items)
   - What you skipped and why
   - Current blockers
   - What to build next session

2. Update `ERRORS.md` with:
   - Any decision points you need from the captain
   - Any conflicts or ambiguities
   - Anything you were unsure about and how you handled it

3. Commit everything with message format:
   `[session N] completed: X, Y, Z | blocked on: A`

Do not end a session without updating these files.
The captain reads STATUS.md and ERRORS.md to stay current.
This is not optional.

---

## CURRENT MISSION

**Session 1 objectives:**
1. Initialize the GitHub repo as public
2. Set up the full file structure
3. Scaffold the Next.js project
4. Set up Supabase clients
5. Build `/api/generate` and `/api/status`
6. Write STATUS.md and ERRORS.md

The captain will review STATUS.md after session 1
and update this file with next instructions.

---

*Last updated by: Claude (Captain)*
*Session: 0 — Initial briefing*
*Next review: After session 1 STATUS.md*

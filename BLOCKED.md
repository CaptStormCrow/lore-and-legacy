# BLOCKED.md
# Lore & Legacy — Deployment Blockers
# Maintained by: Claude Code
# Captain fills these in, then Claude Code deploys.

---

## Status

**Build:** ✅ Passes locally (`npm run build` — 0 errors)
**Repo:** https://github.com/CaptStormCrow/lore-and-legacy
**Live URL:** ✅ https://lore-and-legacy.vercel.app (build is green — runtime features need secrets below)

---

## Env Vars Needed in Vercel Dashboard

Go to: https://vercel.com/dashboard → lore-and-legacy project → Settings → Environment Variables

### ✅ ALREADY KNOWN — Set these immediately

These are safe public values. Set them in Vercel before the first deploy:

| Variable | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://pcxjdutgojfuzkjtvsta.supabase.co` | ✅ SET IN VERCEL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_ZuayYJel4GAk7Of_lx8C0g_XG_Wu57o` | ✅ SET IN VERCEL |
| `NEXT_PUBLIC_URL` | `https://lore-and-legacy.vercel.app` | ✅ SET IN VERCEL |
| `RESEND_FROM_EMAIL` | `worlds@loreandlegacy.com` | ✅ SET IN VERCEL |

---

### 🔑 SECRETS — Required for full runtime functionality

These must be set before the features that use them will work.
The build WILL pass without them. Runtime routes will return 5xx until they're added.

#### Anthropic
| Variable | Where to get it | Used by |
|---|---|---|
| `ANTHROPIC_API_KEY` | console.anthropic.com → API Keys | `/api/generate`, `/api/operator` |

#### Supabase
| Variable | Where to get it | Used by |
|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | supabase.com → Project Settings → API → service_role key | All API routes (bypasses RLS) |

#### Stripe
| Variable | Where to get it | Used by |
|---|---|---|
| `STRIPE_SECRET_KEY` | dashboard.stripe.com → Developers → API Keys → Secret key | `/api/subscribe`, `/api/portal`, `/api/webhooks/stripe` |
| `STRIPE_PUBLISHABLE_KEY` | dashboard.stripe.com → Developers → API Keys → Publishable key | Client-side (not currently wired in, safe to add now) |
| `STRIPE_WEBHOOK_SECRET` | dashboard.stripe.com → Developers → Webhooks → Add endpoint → reveal signing secret | `/api/webhooks/stripe` |
| `STRIPE_PRICE_WANDERER` | Create product in Stripe: $9/mo recurring → copy Price ID (starts with `price_`) | `/api/subscribe` |
| `STRIPE_PRICE_CARTOGRAPHER` | Create product in Stripe: $19/mo recurring → copy Price ID | `/api/subscribe` |
| `STRIPE_PRICE_ARCHITECT` | Create product in Stripe: $29/mo recurring → copy Price ID | `/api/subscribe` |
| `STRIPE_PRICE_FOUNDING_VAULT` | Create product in Stripe: $97 one-time → copy Price ID | `/api/subscribe` |

#### Resend
| Variable | Where to get it | Used by |
|---|---|---|
| `RESEND_API_KEY` | resend.com → API Keys → Create API Key | `/api/operator` (weekly emails) |

#### Internal
| Variable | Value | Used by |
|---|---|---|
| `CRON_SECRET` | Generate: run `openssl rand -hex 32` in any terminal | `/api/operator` (verifies cron calls) |
| `SPONSOR_EMAIL` | Your email address | Escalation digest (referenced in DECISIONS.md O003) |

---

## Stripe Setup Checklist

Before the subscription flow works end-to-end:

1. **Create 4 products** in Stripe dashboard (Products → Create product):
   - Wanderer: $9.00 / month, recurring
   - Cartographer: $19.00 / month, recurring
   - Architect: $29.00 / month, recurring
   - Founding Vault: $97.00, one-time

2. **Copy each Price ID** (format: `price_1ABC...`) into the Vercel env vars above

3. **Register webhook endpoint** in Stripe dashboard:
   - Stripe → Developers → Webhooks → Add endpoint
   - URL: `https://[your-vercel-domain]/api/webhooks/stripe`
   - Events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`
     - `customer.subscription.paused`
   - Copy the Signing Secret → set as `STRIPE_WEBHOOK_SECRET`

---

## Resend Setup Checklist

1. **Verify your sending domain** at resend.com → Domains
   - Add `loreandlegacy.com` and add the DNS records
   - Or use the Resend sandbox domain for testing

2. **Create API key** at resend.com → API Keys
   - Set as `RESEND_API_KEY`

---

## Deployment Order (once env vars are set)

Claude Code will run this automatically on next session:
1. `vercel env add SUPABASE_SERVICE_ROLE_KEY` (paste the value)
2. `vercel env add ANTHROPIC_API_KEY` (paste the value)
3. `vercel --prod` → get live URL
4. Update `NEXT_PUBLIC_URL` in Vercel to the live URL
5. Register Stripe webhook with the live URL
6. Redeploy

---

## Post-Deploy Testing Checklist

- [ ] `GET https://[domain]/api/status` returns JSON (tests Supabase connection)
- [ ] Magic link email arrives when entering email on homepage
- [ ] Subscribe button → Stripe checkout opens
- [ ] Complete a test payment → user tier updates in Supabase
- [ ] `/portal` shows the generate button for paid tier
- [ ] Generate button → world packet appears
- [ ] Share link `/worlds/[token]` renders the packet
- [ ] Stripe webhook signature verified (check logs in Stripe dashboard)

---

*Last updated: Session 2 — 2026-05-22*

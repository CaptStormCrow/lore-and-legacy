# ERRORS.md
# Lore & Legacy — Blockers & Decision Queue
# Maintained by: Claude Code
# Captain reads and resolves these after every session.

---

## How to use this file

When you hit a decision point, ambiguity, or conflict:
1. Write it here clearly
2. Keep building around it if possible
3. Do NOT guess on architecture
4. The captain will resolve and update CLAUDE.md or DECISIONS.md

---

## Open Items

### E001 — Env vars needed before deployment
**Session:** 1
**File/Route affected:** All API routes, vercel.json
**Question/Blocker:**
Deployment to Vercel (item 22) cannot proceed until the captain sets these env vars
in the Vercel project dashboard. The `.env.local` has the two public Supabase keys —
everything else is empty and will cause runtime failures.

Required before deploying:
```
ANTHROPIC_API_KEY=        ← needed by /api/generate and /api/operator
SUPABASE_SERVICE_ROLE_KEY=← needed by all API routes (bypasses RLS)
STRIPE_SECRET_KEY=        ← needed by /api/subscribe, /api/portal, /api/webhooks/stripe
STRIPE_PUBLISHABLE_KEY=   ← needed by portal page (client-side Stripe.js)
STRIPE_WEBHOOK_SECRET=    ← needed by /api/webhooks/stripe (signature verification)
STRIPE_PRICE_WANDERER=    ← needed by /api/subscribe
STRIPE_PRICE_CARTOGRAPHER=← needed by /api/subscribe
STRIPE_PRICE_ARCHITECT=   ← needed by /api/subscribe
STRIPE_PRICE_FOUNDING_VAULT=← needed by /api/subscribe
RESEND_API_KEY=           ← needed by /api/operator (weekly emails)
RESEND_FROM_EMAIL=worlds@loreandlegacy.com
NEXT_PUBLIC_URL=https://loreandlegacy.com
CRON_SECRET=              ← needed by /api/operator (generate a strong random string)
SPONSOR_EMAIL=            ← needed by /api/operator (escalation digest per O003)
```
**Options considered:**
1. Deploy now with empty secrets — routes will 500 at runtime but build succeeds
2. Wait for captain to fill env vars — safe, correct
**Recommendation:** Option 2. Build is verified. Deploy when env vars are ready.
**Status:** OPEN

---

### E002 — increment_usage uses RPC not defined in migration
**Session:** 1
**File/Route affected:** `src/lib/usageCheck.ts`
**Question/Blocker:**
`incrementUsage()` calls `supabase.rpc('increment_usage', ...)` which expects a stored
procedure in the database. The migration in `001_initial.sql` includes a `usage_tracking`
table but does NOT define an `increment_usage` RPC function.

Current workaround: the `rpc()` call will return a PostgreSQL error at runtime but won't
crash the app — the packet is saved and the user gets their result. Usage tracking will
be inaccurate until this is resolved.

**Options considered:**
1. Add a new migration `002_increment_usage_rpc.sql` with the stored procedure
2. Replace the RPC call with a direct upsert in `usageCheck.ts` (no migration needed)
3. Ask captain which pattern is preferred

Suggested stored procedure if captain chooses option 1:
```sql
CREATE OR REPLACE FUNCTION increment_usage(
  p_user_id UUID,
  p_tier TEXT
) RETURNS VOID AS $$
BEGIN
  INSERT INTO usage_tracking (user_id, week_start, tier, count)
  VALUES (
    p_user_id,
    date_trunc('week', NOW()),
    p_tier,
    1
  )
  ON CONFLICT (user_id, week_start)
  DO UPDATE SET
    count = usage_tracking.count + 1,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;
```

Suggested direct upsert if captain chooses option 2 (already handles the logic inline,
no RPC needed).
**Recommendation:** Option 2 — replace with direct upsert, no new migration needed.
Cleaner, no stored procedure to maintain.
**Status:** OPEN

---

### E003 — Git repo not initialized
**Session:** 1
**File/Route affected:** Root directory
**Question/Blocker:**
No git repository has been initialized. GitHub push was not completed.
The project directory contains `&` in the path (`Lore & Legacy`) which causes
shell escaping issues with git commands on Windows.

The junction workaround at `C:\Users\kpbon\WebsiteApps\lore-legacy` works for
npm/build commands but git still needs to be initialized from the real directory.

**Options considered:**
1. Init git and push from the junction path `lore-legacy`
2. Init git from the real path using PowerShell with proper quoting
3. Move all files to a path without `&` permanently
**Recommendation:** Option 1 — use the junction path for all git operations.
Run from `C:\Users\kpbon\WebsiteApps\lore-legacy`:
```powershell
git init
git add .
git commit -m "[session 1] completed: full scaffold, all routes, email templates | blocked on: E001 env vars, E002 usage RPC"
gh repo create lore-and-legacy --public --source=. --remote=origin --push
```
**Status:** OPEN — captain should run these commands or approve Claude Code running them.

---

## Resolved Items

### E001 — Env vars needed before deployment
**Resolved:** Session 2 — all env vars set in Vercel. Site is live.

### E002 — increment_usage uses RPC not defined in migration
**Resolved:** Session 3 — D017 decision applied. `incrementUsage` now takes `(userId: string, tier: string)`, creates its own service client internally, and uses a direct read-then-upsert pattern. No stored procedure needed.

### E003 — Git repo not initialized
**Resolved:** Session 2 — repo initialized and pushed to GitHub as public. Vercel deployment linked.

'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const TIERS = [
  {
    id: 'wanderer',
    name: 'Wanderer',
    price: '$9',
    period: '/month',
    description: 'One world a week, curated entirely by the Worldsmith. The surprise is the product.',
    features: [
      '1 world packet every Monday',
      'Genre chosen by the Worldsmith',
      'Full archive access — every packet ever made',
      'Shareable world links',
      'Cancel anytime',
    ],
    cta: 'Begin Wandering',
    featured: false,
    badge: null,
  },
  {
    id: 'cartographer',
    name: 'Cartographer',
    price: '$19',
    period: '/month',
    description: 'One world a week, shaped by your builder selections. You direct; the Worldsmith executes.',
    features: [
      '1 world packet every Monday',
      'Builder controls: terrain, factions, threats, tone',
      'Saved preferences — set once, receive forever',
      'Full archive access',
      'Shareable world links',
      'Cancel anytime',
    ],
    cta: 'Chart Your Course',
    featured: true,
    badge: 'Most Popular',
  },
  {
    id: 'architect',
    name: 'Architect',
    price: '$29',
    period: '/month',
    description: 'Three worlds a week with full builder control and one custom commission per month.',
    features: [
      '3 world packets every Monday',
      'Full builder control on all three',
      '1 custom world commission per month',
      'Priority generation queue',
      'Full archive access',
      'Shareable world links',
      'Cancel anytime',
    ],
    cta: 'Build Your Legacy',
    featured: false,
    badge: null,
  },
  {
    id: 'founding_vault',
    name: 'Founding Vault',
    price: '$97',
    period: 'one-time',
    description: '12 months of full Architect access. Every packet ever made. Lock in founding member status forever.',
    features: [
      'Full Architect access for 12 months',
      '3 worlds per week, full builder control',
      '1 custom commission per month',
      'Every packet in the archive — past and future',
      'Founding member badge',
      'Rate locked forever — never pay more',
      'Downgrade to Wanderer after 12 months, not free',
    ],
    cta: 'Claim Your Vault',
    featured: false,
    badge: 'Best Value',
  },
];

const FAQ = [
  {
    q: 'When do worlds arrive?',
    a: 'Every Monday at 8 AM UTC. The Worldsmith runs exactly on schedule.',
  },
  {
    q: 'What\'s in a World Packet?',
    a: 'A regional portrait, three factions with hidden tensions, one mystery hook, five NPC seeds, one artifact, and a tone & aesthetic reference. Complete and ready for the table.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel from your portal — no friction, no retention flows. You keep archive access until the period ends.',
  },
  {
    q: 'What\'s the difference between Cartographer and Architect?',
    a: 'Cartographer gives you one world per week with builder control. Architect gives you three worlds per week plus a monthly custom commission.',
  },
  {
    q: 'What happens to my Founding Vault after 12 months?',
    a: 'You move to Wanderer tier — not free. You keep receiving weekly worlds. You just lose the builder controls unless you choose to subscribe.',
  },
];

export default function PricingPage() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [authMode, setAuthMode] = useState<'idle' | 'signin' | 'sent'>('idle');
  const [pendingTier, setPendingTier] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  async function handleSubscribe(tierId: string) {
    setError('');
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setPendingTier(tierId);
      setAuthMode('signin');
      return;
    }
    await startCheckout(tierId, session.user.id, session.user.email ?? '');
  }

  async function startCheckout(tierId: string, userId: string, userEmail: string) {
    setLoading(tierId);
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: tierId, userId, email: userEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Checkout failed');
      if (data.url) window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(null);
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/portal` },
    });
    if (!authError) setAuthMode('sent');
  }

  async function handleAuthSuccess() {
    if (!pendingTier) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setAuthMode('idle');
      await startCheckout(pendingTier, session.user.id, session.user.email ?? '');
      setPendingTier(null);
    }
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Nav */}
      <nav style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
        <div style={{ maxWidth: 1024, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold)', fontSize: 18, letterSpacing: '0.05em', textDecoration: 'none' }}>
            Lore &amp; Legacy
          </a>
          <a href="/portal" style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'Cinzel, serif', letterSpacing: '0.1em', textDecoration: 'none' }}>
            PORTAL
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 640, margin: '0 auto', padding: '72px 24px 56px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Cinzel, serif', fontSize: 11, letterSpacing: '0.35em', color: 'var(--text-dim)', marginBottom: 20 }}>
          CHOOSE YOUR PATH
        </p>
        <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(28px, 5vw, 48px)', color: 'var(--gold)', lineHeight: 1.25, marginBottom: 20 }}>
          Worlds arrive every Monday.
        </h1>
        <p style={{ fontSize: 17, color: 'var(--text-muted)', lineHeight: 1.8 }}>
          Every tier includes full archive access. Cancel anytime. No lock-in except the Vault.
        </p>
        {error && (
          <p style={{ marginTop: 16, color: '#e05050', fontSize: 14 }}>{error}</p>
        )}
      </section>

      {/* Pricing grid */}
      <section style={{ maxWidth: 1024, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 16, alignItems: 'start' }}>
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              style={{
                background: tier.featured ? 'var(--bg-elevated)' : 'var(--bg-card)',
                border: `1px solid ${tier.featured ? 'var(--gold-dim)' : 'var(--border)'}`,
                borderRadius: 4,
                padding: '28px 24px 24px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              {tier.badge && (
                <div style={{
                  position: 'absolute',
                  top: -1,
                  right: 20,
                  background: tier.featured ? 'var(--gold)' : 'var(--bg-elevated)',
                  color: tier.featured ? 'var(--bg)' : 'var(--gold)',
                  border: tier.featured ? 'none' : '1px solid var(--gold-dim)',
                  fontFamily: 'Cinzel, serif',
                  fontSize: 9,
                  letterSpacing: '0.2em',
                  padding: '4px 10px',
                  borderRadius: '0 0 3px 3px',
                }}>
                  {tier.badge.toUpperCase()}
                </div>
              )}

              <h2 style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold)', fontSize: 20, marginBottom: 8, marginTop: tier.badge ? 12 : 0 }}>
                {tier.name}
              </h2>
              <div style={{ marginBottom: 14 }}>
                <span style={{ fontSize: 34, fontFamily: 'Cinzel, serif', color: 'var(--text)' }}>{tier.price}</span>
                <span style={{ color: 'var(--text-dim)', fontSize: 13, marginLeft: 5 }}>{tier.period}</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.65, marginBottom: 20 }}>
                {tier.description}
              </p>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', flex: 1 }}>
                {tier.features.map((f) => (
                  <li key={f} style={{ color: 'var(--text-muted)', fontSize: 13, padding: '5px 0 5px 18px', position: 'relative', lineHeight: 1.5 }}>
                    <span style={{ position: 'absolute', left: 0, color: 'var(--gold)' }}>·</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(tier.id)}
                disabled={loading === tier.id}
                style={{
                  background: tier.featured ? 'var(--gold)' : 'transparent',
                  color: tier.featured ? 'var(--bg)' : 'var(--gold)',
                  border: `1px solid ${tier.featured ? 'var(--gold)' : 'var(--gold-dim)'}`,
                  padding: '12px 20px',
                  fontFamily: 'Cinzel, serif',
                  fontSize: 12,
                  letterSpacing: '0.12em',
                  cursor: loading === tier.id ? 'not-allowed' : 'pointer',
                  borderRadius: 2,
                  width: '100%',
                  opacity: loading === tier.id ? 0.6 : 1,
                  transition: 'opacity 0.15s',
                }}
              >
                {loading === tier.id ? 'Loading...' : tier.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px 80px' }}>
        <h2 style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold)', fontSize: 22, textAlign: 'center', marginBottom: 40 }}>
          Questions
        </h2>
        {FAQ.map((item, i) => (
          <div
            key={i}
            style={{ borderTop: '1px solid var(--border)', padding: '20px 0' }}
          >
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{
                background: 'none',
                border: 'none',
                width: '100%',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <span style={{ fontFamily: 'Cinzel, serif', fontSize: 14, color: 'var(--text)', letterSpacing: '0.02em' }}>
                {item.q}
              </span>
              <span style={{ color: 'var(--gold)', fontSize: 18, flexShrink: 0 }}>
                {openFaq === i ? '−' : '+'}
              </span>
            </button>
            {openFaq === i && (
              <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.75, marginTop: 12, paddingRight: 32 }}>
                {item.a}
              </p>
            )}
          </div>
        ))}
        <div style={{ borderTop: '1px solid var(--border)' }} />
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '32px 24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-dim)', fontSize: 13 }}>
          &copy; 2026 Lore &amp; Legacy &nbsp;·&nbsp;
          <a href="/privacy" style={{ color: 'var(--text-dim)' }}>Privacy</a>
          &nbsp;·&nbsp;
          <a href="/terms" style={{ color: 'var(--text-dim)' }}>Terms</a>
          &nbsp;·&nbsp;
          <a href="mailto:worlds@loreandlegacy.com" style={{ color: 'var(--text-dim)' }}>Contact</a>
        </p>
      </footer>

      {/* Auth modal */}
      {(authMode === 'signin' || authMode === 'sent') && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) { setAuthMode('idle'); setPendingTier(null); } }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
        >
          <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 4, padding: '40px 36px', maxWidth: 400, width: '90%' }}>
            {authMode === 'signin' ? (
              <>
                <h2 style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold)', marginBottom: 8 }}>Sign In to Subscribe</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
                  Enter your email and we&apos;ll send a magic link. No password needed.
                  You&apos;ll be taken to checkout after signing in.
                </p>
                <form onSubmit={handleMagicLink}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    style={{ width: '100%', padding: '10px 12px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 2, marginBottom: 12, fontSize: 15, boxSizing: 'border-box' }}
                  />
                  <button
                    type="submit"
                    style={{ width: '100%', background: 'var(--gold)', color: 'var(--bg)', border: 'none', padding: '11px', fontFamily: 'Cinzel, serif', fontSize: 12, letterSpacing: '0.1em', cursor: 'pointer', borderRadius: 2 }}
                  >
                    SEND MAGIC LINK
                  </button>
                </form>
                <button onClick={() => { setAuthMode('idle'); setPendingTier(null); }} style={{ marginTop: 16, background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: 13 }}>
                  Cancel
                </button>
              </>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold)', marginBottom: 16 }}>Check Your Email</h2>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                  A magic link has been sent to <strong style={{ color: 'var(--text)' }}>{email}</strong>.
                  Click it to sign in — you&apos;ll be redirected to checkout automatically.
                </p>
                <button onClick={handleAuthSuccess} style={{ marginTop: 24, background: 'var(--gold)', color: 'var(--bg)', border: 'none', padding: '10px 24px', fontFamily: 'Cinzel, serif', fontSize: 12, letterSpacing: '0.1em', cursor: 'pointer', borderRadius: 2 }}>
                  I&apos;m Signed In
                </button>
                <button onClick={() => { setAuthMode('idle'); setPendingTier(null); }} style={{ display: 'block', margin: '12px auto 0', background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: 13 }}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

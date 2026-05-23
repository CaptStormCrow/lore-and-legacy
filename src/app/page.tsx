'use client';

const TIERS = [
  {
    id: 'wanderer',
    name: 'Wanderer',
    price: '$9',
    period: '/month',
    description: 'One world a week, curated entirely by the Worldsmith.',
    features: ['1 world packet per week', 'Random genre — the surprise is the product', 'Full archive access', 'Share links'],
    cta: 'Begin Wandering',
    featured: false,
  },
  {
    id: 'cartographer',
    name: 'Cartographer',
    price: '$19',
    period: '/month',
    description: 'One world a week, shaped by your builder selections.',
    features: ['1 world packet per week', 'Builder controls: terrain, factions, threats', 'Saved preferences', 'Full archive access'],
    cta: 'Chart Your Course',
    featured: true,
  },
  {
    id: 'architect',
    name: 'Architect',
    price: '$29',
    period: '/month',
    description: 'Three worlds a week and one custom commission per month.',
    features: ['3 world packets per week', 'Full builder control', '1 custom commission/month', 'Priority generation'],
    cta: 'Build Your Legacy',
    featured: false,
  },
  {
    id: 'founding_vault',
    name: 'Founding Vault',
    price: '$97',
    period: 'one-time',
    description: '12 months of Architect access. Every packet ever made. Founding member status.',
    features: ['Full Architect access for 12 months', 'Every packet in the archive', 'Founding member badge', 'Lock in the rate forever'],
    cta: 'Claim Your Vault',
    featured: false,
  },
];

export default function HomePage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Nav */}
      <nav style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold)', fontSize: 18, letterSpacing: '0.05em' }}>Lore &amp; Legacy</span>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <a href="/portal" style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'Cinzel, serif', letterSpacing: '0.1em' }}>PORTAL</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 680, margin: '0 auto', padding: '100px 24px 80px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Cinzel, serif', fontSize: 11, letterSpacing: '0.35em', color: 'var(--text-dim)', marginBottom: 28 }}>
          WEEKLY WORLD PACKETS FOR TTRPG STORYTELLERS
        </p>
        <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(34px, 6vw, 60px)', color: 'var(--gold)', lineHeight: 1.2, marginBottom: 24 }}>
          A new world,<br />delivered every week.
        </h1>
        <p style={{ fontSize: 19, color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 48 }}>
          Every World Packet contains a fully cohesive fictional region — portrait, three factions,
          one mystery hook, five NPC seeds, one artifact, and a tone reference.
          Ready for your table Monday morning.
        </p>
        <a
          href="#pricing"
          style={{ display: 'inline-block', background: 'var(--gold)', color: 'var(--bg)', padding: '14px 40px', fontFamily: 'Cinzel, serif', fontSize: 13, letterSpacing: '0.15em', borderRadius: 2, textDecoration: 'none' }}
        >
          START RECEIVING WORLDS
        </a>
      </section>

      {/* What's in a packet */}
      <section style={{ borderTop: '1px solid var(--border)', padding: '64px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold)', textAlign: 'center', fontSize: 26, marginBottom: 48 }}>
            Every World Packet Contains
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {[
              ['Regional Portrait', 'Vivid atmosphere, geography, and sensory detail. Sets the scene in two paragraphs.'],
              ['Three Factions', 'Who holds power, who wants it, and who burns it all down. Each with a hidden tension.'],
              ['Mystery Hook', 'One strange, unanswered question that haunts the land.'],
              ['Five NPC Seeds', 'Names and 8-word personality capsules — ready to voice at the table.'],
              ['Artifact', 'A named relic with appearance and one mechanical suggestion.'],
              ['Tone Reference', 'Mood and two real-world aesthetic influences for the GM.'],
            ].map(([title, desc]) => (
              <div key={title} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 4, padding: '20px 18px' }}>
                <p style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold)', fontSize: 12, letterSpacing: '0.08em', marginBottom: 10 }}>{title.toUpperCase()}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ borderTop: '1px solid var(--border)', padding: '64px 24px 80px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold)', textAlign: 'center', fontSize: 26, marginBottom: 12 }}>
            Choose Your Path
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 15, marginBottom: 48 }}>
            Worlds arrive every Monday. Cancel anytime.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            {TIERS.map((tier) => (
              <div
                key={tier.id}
                style={{
                  background: tier.featured ? 'var(--bg-elevated)' : 'var(--bg-card)',
                  border: tier.featured ? '1px solid var(--gold-dim)' : '1px solid var(--border)',
                  borderRadius: 4,
                  padding: '28px 22px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {tier.featured && (
                  <p style={{ fontFamily: 'Cinzel, serif', fontSize: 10, letterSpacing: '0.3em', color: 'var(--gold)', marginBottom: 14 }}>
                    MOST POPULAR
                  </p>
                )}
                <h3 style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold)', fontSize: 20, marginBottom: 6 }}>{tier.name}</h3>
                <div style={{ marginBottom: 12 }}>
                  <span style={{ fontSize: 30, fontFamily: 'Cinzel, serif', color: 'var(--text)' }}>{tier.price}</span>
                  <span style={{ color: 'var(--text-dim)', fontSize: 13, marginLeft: 4 }}>{tier.period}</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 18 }}>{tier.description}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', flex: 1 }}>
                  {tier.features.map((f) => (
                    <li key={f} style={{ color: 'var(--text-muted)', fontSize: 13, padding: '5px 0 5px 18px', position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 0, color: 'var(--gold)' }}>·</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="/pricing"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    textDecoration: 'none',
                    background: tier.featured ? 'var(--gold)' : 'transparent',
                    color: tier.featured ? 'var(--bg)' : 'var(--gold)',
                    border: `1px solid ${tier.featured ? 'var(--gold)' : 'var(--gold-dim)'}`,
                    padding: '11px 20px',
                    fontFamily: 'Cinzel, serif',
                    fontSize: 12,
                    letterSpacing: '0.12em',
                    borderRadius: 2,
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                >
                  {tier.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
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
    </div>
  );
}

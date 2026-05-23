export default function TermsPage() {
  return (
    <div className="min-h-screen py-16 px-6" style={{ background: 'var(--bg)' }}>
      <div className="max-w-2xl mx-auto">
        <a href="/" className="text-xs font-cinzel tracking-widest" style={{ color: 'var(--text-dim)' }}>
          ← LORE &amp; LEGACY
        </a>
        <h1 className="text-3xl mt-8 mb-8" style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold)' }}>
          Terms of Service
        </h1>
        <div className="space-y-6" style={{ color: 'var(--text-muted)' }}>
          <p><strong style={{ color: 'var(--text)' }}>Last updated:</strong> May 2026</p>

          <Section title="The Service">
            <p>Lore &amp; Legacy provides AI-generated world-building content for personal and commercial tabletop RPG use. You own the worlds you generate. We retain no rights to content created using your subscription.</p>
          </Section>

          <Section title="Subscriptions">
            <p>Subscriptions renew automatically. You may cancel at any time through your subscriber portal. Cancellation takes effect at the end of your current billing period. No refunds for partial periods.</p>
          </Section>

          <Section title="Founding Vault">
            <p>The Founding Vault is a one-time payment for 12 months of Architect access. Upon expiry, your account transitions to Wanderer tier automatically.</p>
          </Section>

          <Section title="Acceptable Use">
            <p>You may use generated worlds for personal campaigns, published adventures, commercial products, and streaming content. You may not resell raw world packets without substantial modification.</p>
          </Section>

          <Section title="Commissions">
            <p>Architect subscribers may submit one custom world commission per calendar month. Commissions are non-refundable once delivered.</p>
          </Section>

          <Section title="Limitations">
            <p>We are not liable for any indirect damages arising from use of this service. Our total liability is limited to amounts paid in the prior 30 days.</p>
          </Section>

          <Section title="Contact">
            <p>Questions? Email worlds@loreandlegacy.com</p>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-cinzel text-sm tracking-widest mb-3" style={{ color: 'var(--gold)' }}>
        {title.toUpperCase()}
      </h2>
      {children}
    </div>
  );
}

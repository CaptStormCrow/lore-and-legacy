export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-16 px-6" style={{ background: 'var(--bg)' }}>
      <div className="max-w-2xl mx-auto">
        <a href="/" className="text-xs font-cinzel tracking-widest" style={{ color: 'var(--text-dim)' }}>
          ← LORE &amp; LEGACY
        </a>
        <h1 className="text-3xl mt-8 mb-8" style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold)' }}>
          Privacy Policy
        </h1>
        <div className="prose prose-invert space-y-6" style={{ color: 'var(--text-muted)' }}>
          <p><strong style={{ color: 'var(--text)' }}>Last updated:</strong> May 2026</p>

          <Section title="What We Collect">
            <p>We collect your email address when you subscribe or sign up. We collect generated world data that you create using our service. We collect basic usage analytics to improve the service.</p>
          </Section>

          <Section title="How We Use It">
            <p>Your email is used to deliver your weekly world packets and service communications. We never sell your data to third parties. Generated worlds are stored to power your personal archive.</p>
          </Section>

          <Section title="Payments">
            <p>All payment processing is handled by Stripe. We do not store credit card information. Stripe&apos;s privacy policy governs payment data.</p>
          </Section>

          <Section title="Cookies">
            <p>We use session cookies for authentication only. No tracking cookies or advertising pixels.</p>
          </Section>

          <Section title="Data Deletion">
            <p>You may request deletion of your account and all associated data by emailing worlds@loreandlegacy.com. We will process deletion within 30 days.</p>
          </Section>

          <Section title="Contact">
            <p>Questions? Email us at worlds@loreandlegacy.com</p>
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

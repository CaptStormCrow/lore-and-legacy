import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface PaymentFailedEmailProps {
  tier: string;
  billingPortalUrl: string;
  retryCount: number;
}

export default function PaymentFailedEmail({
  tier = 'Wanderer',
  billingPortalUrl = 'https://loreandlegacy.com/api/portal',
  retryCount = 1,
}: PaymentFailedEmailProps) {
  const isLastRetry = retryCount >= 3;

  return (
    <Html>
      <Head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&display=swap');
        `}</style>
      </Head>
      <Preview>
        {isLastRetry
          ? 'Your subscription has been downgraded. Update your payment to restore access.'
          : 'Payment failed — update your card to keep your worlds coming.'}
      </Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>LORE & LEGACY</Heading>
          </Section>

          <Section style={alertBanner}>
            <Text style={alertText}>
              {isLastRetry ? 'Subscription Downgraded' : 'Payment Failed'}
            </Text>
          </Section>

          <Section style={main}>
            {isLastRetry ? (
              <>
                <Heading style={h2}>The gates have closed.</Heading>
                <Text style={paragraph}>
                  After three attempts, we were unable to process your {tier} subscription payment.
                  Your account has been moved to the free tier — your world archive is preserved
                  and your account remains open.
                </Text>
                <Text style={paragraph}>
                  Update your payment method to restore your {tier} access immediately.
                  All past worlds in your archive will still be there waiting.
                </Text>
              </>
            ) : (
              <>
                <Heading style={h2}>A payment didn&apos;t go through.</Heading>
                <Text style={paragraph}>
                  We couldn&apos;t charge the card on your {tier} subscription.
                  We&apos;ll try again automatically — but to avoid any interruption to your
                  weekly deliveries, update your payment method now.
                </Text>
                <Text style={paragraph}>
                  Attempt {retryCount} of 3. If this keeps failing, your subscription will be
                  downgraded to the free tier (your archive stays intact).
                </Text>
              </>
            )}

            <Section style={ctaSection}>
              <Link href={billingPortalUrl} style={cta}>
                Update Payment Method
              </Link>
            </Section>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              Lore & Legacy · <Link href="https://loreandlegacy.com/privacy" style={footerLink}>Privacy</Link>
              {' · '}<Link href="https://loreandlegacy.com/terms" style={footerLink}>Terms</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body: React.CSSProperties = {
  backgroundColor: '#0d0a07',
  fontFamily: "'Crimson Pro', Georgia, serif",
};

const container: React.CSSProperties = {
  maxWidth: '600px',
  margin: '0 auto',
};

const header: React.CSSProperties = {
  backgroundColor: '#1a1208',
  borderBottom: '1px solid #c9a84c',
  padding: '28px 40px 20px',
  textAlign: 'center',
};

const logo: React.CSSProperties = {
  fontFamily: "'Cinzel', Georgia, serif",
  fontSize: '22px',
  fontWeight: '600',
  color: '#c9a84c',
  letterSpacing: '0.2em',
  margin: '0',
};

const alertBanner: React.CSSProperties = {
  backgroundColor: '#2a1208',
  borderBottom: '1px solid #8b3a2a',
  padding: '12px 40px',
  textAlign: 'center',
};

const alertText: React.CSSProperties = {
  fontFamily: "'Cinzel', Georgia, serif",
  fontSize: '13px',
  fontWeight: '600',
  color: '#e87050',
  letterSpacing: '0.15em',
  textTransform: 'uppercase' as const,
  margin: '0',
};

const main: React.CSSProperties = {
  backgroundColor: '#110e09',
  padding: '40px',
  borderLeft: '1px solid #2a2018',
  borderRight: '1px solid #2a2018',
};

const h2: React.CSSProperties = {
  fontFamily: "'Cinzel', Georgia, serif",
  fontSize: '22px',
  fontWeight: '600',
  color: '#e8dcc8',
  margin: '0 0 24px',
};

const paragraph: React.CSSProperties = {
  fontFamily: "'Crimson Pro', Georgia, serif",
  fontSize: '17px',
  lineHeight: '1.7',
  color: '#c8b89a',
  margin: '0 0 20px',
};

const ctaSection: React.CSSProperties = {
  textAlign: 'center',
  marginTop: '32px',
};

const cta: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: '#c9a84c',
  color: '#0d0a07',
  fontFamily: "'Cinzel', Georgia, serif",
  fontSize: '13px',
  fontWeight: '600',
  letterSpacing: '0.12em',
  padding: '14px 32px',
  textDecoration: 'none',
  textTransform: 'uppercase' as const,
};

const footer: React.CSSProperties = {
  backgroundColor: '#0a0806',
  borderTop: '1px solid #2a2018',
  padding: '24px 40px',
  textAlign: 'center',
};

const footerText: React.CSSProperties = {
  fontFamily: "'Crimson Pro', Georgia, serif",
  fontSize: '13px',
  color: '#4a4030',
  margin: '4px 0',
};

const footerLink: React.CSSProperties = {
  color: '#6a5a3a',
  textDecoration: 'none',
};

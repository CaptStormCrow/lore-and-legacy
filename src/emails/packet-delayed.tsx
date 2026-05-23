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

interface PacketDelayedEmailProps {
  portalUrl: string;
  estimatedDelivery: string;
}

export default function PacketDelayedEmail({
  portalUrl = 'https://loreandlegacy.com/portal',
  estimatedDelivery = 'within 24 hours',
}: PacketDelayedEmailProps) {
  return (
    <Html>
      <Head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&display=swap');
        `}</style>
      </Head>
      <Preview>Your world packet is delayed — the Worldsmith is still at work.</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>LORE & LEGACY</Heading>
          </Section>

          <Section style={main}>
            <Heading style={h2}>The Worldsmith is still forging.</Heading>
            <Text style={paragraph}>
              Your weekly packet was delayed this Monday. The Worldsmith encountered
              a disturbance in the forges — not uncommon when reality is being bent
              to purpose.
            </Text>
            <Text style={paragraph}>
              Your world is still being built. Expected delivery: <strong style={accent}>{estimatedDelivery}</strong>.
              You&apos;ll receive it directly in your portal the moment it&apos;s complete.
            </Text>
            <Text style={paragraph}>
              Your subscription is unaffected. This delay will not count against
              your weekly allocation.
            </Text>

            <Section style={ctaSection}>
              <Link href={portalUrl} style={cta}>
                Check Your Portal
              </Link>
            </Section>

            <Text style={note}>
              If you don&apos;t receive your packet within 48 hours, reply to this email
              and we&apos;ll sort it immediately.
            </Text>
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

const accent: React.CSSProperties = {
  color: '#c9a84c',
};

const ctaSection: React.CSSProperties = {
  textAlign: 'center',
  margin: '32px 0',
};

const cta: React.CSSProperties = {
  display: 'inline-block',
  border: '1px solid #c9a84c',
  color: '#c9a84c',
  fontFamily: "'Cinzel', Georgia, serif",
  fontSize: '13px',
  fontWeight: '600',
  letterSpacing: '0.12em',
  padding: '12px 28px',
  textDecoration: 'none',
  textTransform: 'uppercase' as const,
};

const note: React.CSSProperties = {
  fontFamily: "'Crimson Pro', Georgia, serif",
  fontSize: '15px',
  fontStyle: 'italic',
  color: '#7a6a4a',
  margin: '0',
  textAlign: 'center',
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

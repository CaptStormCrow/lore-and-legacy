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

interface WelcomeEmailProps {
  tier: string;
  portalUrl: string;
}

export default function WelcomeEmail({ tier = 'Wanderer', portalUrl = 'https://loreandlegacy.com/portal' }: WelcomeEmailProps) {
  return (
    <Html>
      <Head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&display=swap');
        `}</style>
      </Head>
      <Preview>Your first World Packet arrives this Monday. Welcome to Lore & Legacy.</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>LORE & LEGACY</Heading>
            <Text style={tagline}>The Worldsmith Awaits</Text>
          </Section>

          <Section style={main}>
            <Heading style={h2}>The gates are open.</Heading>
            <Text style={paragraph}>
              You&apos;ve joined as a <strong style={accent}>{tier}</strong> subscriber.
              Every Monday at 8 AM UTC, the Worldsmith forges a new world fragment and
              delivers it to your portal.
            </Text>
            <Text style={paragraph}>
              Your first packet arrives this Monday. Until then, your portal is waiting —
              browse the archive, configure your builder preferences, and prepare for what comes.
            </Text>

            <Section style={ctaSection}>
              <Link href={portalUrl} style={cta}>
                Enter Your Portal
              </Link>
            </Section>

            <Text style={paragraph}>
              If you have questions or need anything, reply to this message directly.
              We read everything.
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              Lore & Legacy · <Link href="https://loreandlegacy.com/privacy" style={footerLink}>Privacy</Link>{' '}
              · <Link href="https://loreandlegacy.com/terms" style={footerLink}>Terms</Link>
            </Text>
            <Text style={footerText}>
              You&apos;re receiving this because you subscribed at loreandlegacy.com.
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
  padding: '0',
};

const header: React.CSSProperties = {
  backgroundColor: '#1a1208',
  borderBottom: '1px solid #c9a84c',
  padding: '32px 40px 24px',
  textAlign: 'center',
};

const logo: React.CSSProperties = {
  fontFamily: "'Cinzel', Georgia, serif",
  fontSize: '24px',
  fontWeight: '600',
  color: '#c9a84c',
  letterSpacing: '0.2em',
  margin: '0 0 8px',
};

const tagline: React.CSSProperties = {
  fontFamily: "'Crimson Pro', Georgia, serif",
  fontSize: '14px',
  color: '#8a7a5a',
  fontStyle: 'italic',
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
  backgroundColor: '#c9a84c',
  color: '#0d0a07',
  fontFamily: "'Cinzel', Georgia, serif",
  fontSize: '14px',
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

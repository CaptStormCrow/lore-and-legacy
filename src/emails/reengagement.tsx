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

interface ReengagementEmailProps {
  packetCount: number;
  latestWorld: string;
  portalUrl: string;
  upgradeUrl: string;
}

export default function ReengagementEmail({
  packetCount = 12,
  latestWorld = 'The Ashen Marches',
  portalUrl = 'https://loreandlegacy.com/portal',
  upgradeUrl = 'https://loreandlegacy.com',
}: ReengagementEmailProps) {
  return (
    <Html>
      <Head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&display=swap');
        `}</style>
      </Head>
      <Preview>{`${packetCount} worlds have been forged since your last visit.`}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>LORE & LEGACY</Heading>
            <Text style={tagline}>The Forge Never Sleeps</Text>
          </Section>

          <Section style={main}>
            <Heading style={h2}>The worlds keep coming.</Heading>
            <Text style={paragraph}>
              The Worldsmith has forged <strong style={accent}>{packetCount} new worlds</strong> since
              you last visited. The most recent — <em style={worldNameStyle}>{latestWorld}</em> —
              is waiting in the archive.
            </Text>
            <Text style={paragraph}>
              Every packet is fully cohesive: a regional portrait, three factions in tension,
              a mystery hook, five NPC seeds, an artifact, and a complete tone reference.
              Ready to drop into any campaign.
            </Text>
            <Text style={paragraph}>
              Your archive isn&apos;t going anywhere. Everything the Worldsmith has built
              is still there, organized and searchable.
            </Text>

            <Section style={ctaSection}>
              <Link href={portalUrl} style={cta}>
                Return to the Archive
              </Link>
            </Section>

            <Section style={upgradeSection}>
              <Text style={upgradeText}>
                Want more control over what gets built?{' '}
                <Link href={upgradeUrl} style={upgradeLink}>Upgrade your tier</Link>{' '}
                to direct the Worldsmith yourself.
              </Text>
            </Section>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              Lore & Legacy · <Link href="https://loreandlegacy.com/privacy" style={footerLink}>Privacy</Link>
              {' · '}<Link href="https://loreandlegacy.com/terms" style={footerLink}>Terms</Link>
            </Text>
            <Text style={footerText}>
              You&apos;re receiving this because you have an active Lore & Legacy account.
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
  margin: '0 0 6px',
};

const tagline: React.CSSProperties = {
  fontFamily: "'Crimson Pro', Georgia, serif",
  fontSize: '13px',
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

const worldNameStyle: React.CSSProperties = {
  color: '#e8dcc8',
};

const ctaSection: React.CSSProperties = {
  textAlign: 'center',
  margin: '32px 0 24px',
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

const upgradeSection: React.CSSProperties = {
  borderTop: '1px solid #1e1a12',
  paddingTop: '24px',
  textAlign: 'center',
};

const upgradeText: React.CSSProperties = {
  fontFamily: "'Crimson Pro', Georgia, serif",
  fontSize: '16px',
  color: '#8a7a5a',
  margin: '0',
};

const upgradeLink: React.CSSProperties = {
  color: '#c9a84c',
  textDecoration: 'none',
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

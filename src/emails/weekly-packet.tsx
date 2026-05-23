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
import type { WorldPacket } from '../types';

interface WeeklyPacketEmailProps {
  packet: WorldPacket;
  shareUrl: string;
  portalUrl: string;
  tier: string;
}

export default function WeeklyPacketEmail({
  packet,
  shareUrl = 'https://loreandlegacy.com/worlds/abc123',
  portalUrl = 'https://loreandlegacy.com/portal',
  tier = 'Wanderer',
}: WeeklyPacketEmailProps) {
  return (
    <Html>
      <Head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&display=swap');
        `}</style>
      </Head>
      <Preview>{packet?.worldName ?? 'Your World Packet'} — {packet?.tagline ?? 'A new world has arrived.'}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>LORE & LEGACY</Heading>
            <Text style={tagline}>Weekly World Packet</Text>
          </Section>

          <Section style={heroSection}>
            <Heading style={worldName}>{packet?.worldName ?? 'Unknown World'}</Heading>
            <Text style={worldTagline}>&ldquo;{packet?.tagline ?? ''}&rdquo;</Text>
          </Section>

          <Section style={main}>
            <Text style={paragraph}>{packet?.regionalPortrait ?? ''}</Text>

            {packet?.factions && packet.factions.length > 0 && (
              <Section style={block}>
                <Heading style={blockTitle}>Factions</Heading>
                {packet.factions.map((faction, i) => (
                  <Section key={i} style={factionBlock}>
                    <Text style={factionName}>{faction.name}</Text>
                    <Text style={factionDesc}>{faction.description}</Text>
                  </Section>
                ))}
              </Section>
            )}

            {packet?.mysteryHook && (
              <Section style={block}>
                <Heading style={blockTitle}>The Mystery</Heading>
                <Text style={mysteryText}>{packet.mysteryHook}</Text>
              </Section>
            )}

            {packet?.artifactName && (
              <Section style={block}>
                <Heading style={blockTitle}>Artifact: {packet.artifactName}</Heading>
                <Text style={paragraph}>{packet.artifactDescription}</Text>
              </Section>
            )}

            {packet?.toneAesthetic && (
              <Section style={block}>
                <Heading style={blockTitle}>Tone & Aesthetic</Heading>
                <Text style={paragraph}>{packet.toneAesthetic}</Text>
              </Section>
            )}

            <Section style={ctaSection}>
              <Link href={shareUrl} style={ctaSecondary}>
                View Full Packet
              </Link>
              {tier !== 'wanderer' && (
                <Link href={portalUrl} style={cta}>
                  Open Builder
                </Link>
              )}
            </Section>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              Lore & Legacy · <Link href="https://loreandlegacy.com/privacy" style={footerLink}>Privacy</Link>
              {' · '}<Link href="https://loreandlegacy.com/terms" style={footerLink}>Terms</Link>
            </Text>
            <Text style={footerText}>
              Your {tier} subscription delivers worlds every Monday.
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

const heroSection: React.CSSProperties = {
  backgroundColor: '#1a1208',
  borderBottom: '1px solid #2a2018',
  padding: '32px 40px',
  textAlign: 'center',
};

const worldName: React.CSSProperties = {
  fontFamily: "'Cinzel', Georgia, serif",
  fontSize: '30px',
  fontWeight: '600',
  color: '#e8dcc8',
  margin: '0 0 12px',
  letterSpacing: '0.05em',
};

const worldTagline: React.CSSProperties = {
  fontFamily: "'Crimson Pro', Georgia, serif",
  fontSize: '18px',
  fontStyle: 'italic',
  color: '#c9a84c',
  margin: '0',
};

const main: React.CSSProperties = {
  backgroundColor: '#110e09',
  padding: '40px',
  borderLeft: '1px solid #2a2018',
  borderRight: '1px solid #2a2018',
};

const block: React.CSSProperties = {
  marginBottom: '28px',
  paddingBottom: '28px',
  borderBottom: '1px solid #1e1a12',
};

const blockTitle: React.CSSProperties = {
  fontFamily: "'Cinzel', Georgia, serif",
  fontSize: '13px',
  fontWeight: '600',
  color: '#c9a84c',
  letterSpacing: '0.15em',
  textTransform: 'uppercase' as const,
  margin: '0 0 12px',
};

const paragraph: React.CSSProperties = {
  fontFamily: "'Crimson Pro', Georgia, serif",
  fontSize: '17px',
  lineHeight: '1.7',
  color: '#c8b89a',
  margin: '0 0 12px',
};

const factionBlock: React.CSSProperties = {
  marginBottom: '16px',
};

const factionName: React.CSSProperties = {
  fontFamily: "'Cinzel', Georgia, serif",
  fontSize: '15px',
  fontWeight: '600',
  color: '#e8dcc8',
  margin: '0 0 4px',
};

const factionDesc: React.CSSProperties = {
  fontFamily: "'Crimson Pro', Georgia, serif",
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#a89878',
  margin: '0',
};

const mysteryText: React.CSSProperties = {
  fontFamily: "'Crimson Pro', Georgia, serif",
  fontSize: '17px',
  fontStyle: 'italic',
  lineHeight: '1.7',
  color: '#b8a888',
  margin: '0',
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
  padding: '12px 28px',
  textDecoration: 'none',
  textTransform: 'uppercase' as const,
  marginLeft: '12px',
};

const ctaSecondary: React.CSSProperties = {
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

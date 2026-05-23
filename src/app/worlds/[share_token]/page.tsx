export const dynamic = 'force-dynamic';

import { createServiceClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import type { Packet } from '@/types';

interface Props {
  params: Promise<{ share_token: string }>;
}

export default async function WorldSharePage({ params }: Props) {
  const { share_token } = await params;
  const supabase = await createServiceClient();

  const { data: packet } = await supabase
    .from('packets')
    .select('*')
    .eq('share_token', share_token)
    .single();

  if (!packet) notFound();

  // Increment view count
  await supabase
    .from('packets')
    .update({ view_count: (packet.view_count ?? 0) + 1 })
    .eq('share_token', share_token);

  const p = packet as Packet;

  return (
    <div className="min-h-screen py-16 px-6" style={{ background: 'var(--bg)' }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <a href="/" className="text-xs font-cinzel tracking-widest" style={{ color: 'var(--text-dim)' }}>
          LORE &amp; LEGACY
        </a>

        <div className="mt-8 mb-2 text-xs font-cinzel tracking-widest" style={{ color: 'var(--text-dim)' }}>
          WORLD PACKET · {p.genre?.toUpperCase()}
        </div>

        <h1 className="text-4xl md:text-5xl mb-3" style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold)' }}>
          {p.world_name}
        </h1>

        {p.tagline && (
          <p className="text-xl italic mb-10" style={{ color: 'var(--text-muted)' }}>
            {p.tagline}
          </p>
        )}

        <Divider />

        {/* Regional Portrait */}
        {p.regional_portrait && (
          <Section title="The Land">
            <p className="text-lg leading-relaxed">{p.regional_portrait}</p>
          </Section>
        )}

        {/* Factions */}
        {p.factions && Array.isArray(p.factions) && p.factions.length > 0 && (
          <Section title="Factions">
            <div className="space-y-5">
              {p.factions.map((f, i) => (
                <div key={i}>
                  <h3 className="font-cinzel text-base mb-1" style={{ color: 'var(--gold)' }}>{f.name}</h3>
                  <p>{f.description}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Mystery Hook */}
        {p.mystery_hook && (
          <Section title="The Mystery">
            <p className="text-lg italic" style={{ color: 'var(--text-muted)' }}>{p.mystery_hook}</p>
          </Section>
        )}

        {/* NPCs */}
        {p.npcs && Array.isArray(p.npcs) && p.npcs.length > 0 && (
          <Section title="Souls of Note">
            <div className="grid sm:grid-cols-2 gap-3">
              {p.npcs.map((n, i) => (
                <div key={i} className="p-4 rounded border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                  <p className="font-cinzel text-sm mb-1" style={{ color: 'var(--gold)' }}>{n.name}</p>
                  <p className="text-sm italic" style={{ color: 'var(--text-muted)' }}>{n.seed}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Artifact */}
        {p.artifact_name && (
          <Section title="Artifact">
            <p className="font-cinzel mb-2" style={{ color: 'var(--gold-light)' }}>{p.artifact_name}</p>
            <p>{p.artifact_description}</p>
          </Section>
        )}

        {/* Tone */}
        {p.tone_aesthetic && (
          <Section title="Tone &amp; Aesthetic">
            <p className="italic">{p.tone_aesthetic}</p>
          </Section>
        )}

        <Divider />

        <div className="mt-10 text-center">
          <p className="text-xs font-cinzel tracking-widest mb-4" style={{ color: 'var(--text-dim)' }}>
            WANT WORLDS LIKE THIS EVERY WEEK?
          </p>
          <a
            href="/"
            className="inline-block px-8 py-3 font-cinzel text-sm tracking-widest rounded"
            style={{ background: 'var(--gold)', color: 'var(--bg)' }}
          >
            Join Lore &amp; Legacy
          </a>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="my-10">
      <h2 className="text-xs font-cinzel tracking-widest mb-4" style={{ color: 'var(--text-dim)' }}>
        {title.toUpperCase()}
      </h2>
      {children}
    </section>
  );
}

function Divider() {
  return <div className="my-8 h-px" style={{ background: 'var(--border)' }} />;
}

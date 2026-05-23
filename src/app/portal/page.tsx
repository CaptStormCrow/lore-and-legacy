'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Packet, User, BuilderPreferences } from '@/types';

const BUILDER_OPTIONS = {
  terrain: ['Mountain Fortress', 'Deep Forest', 'Coastal Ruin', 'Desert Waste', 'Underground City', 'Sky Islands'],
  power_structure: ['Feudal Kingdom', 'Theocracy', 'Merchant Republic', 'Warlord Territory', 'Ancient Empire', 'Anarchy'],
  primary_threat: ['Undead Uprising', 'Eldritch Incursion', 'Civil War', 'Plague', 'Dragon Hegemony', 'Fae Infestation'],
  dominant_races: ['Human', 'Elvish', 'Dwarven', 'Orcish', 'Mixed', 'Non-human'],
  monster_type: ['Undead', 'Aberration', 'Beast', 'Demon', 'Construct', 'Fae'],
  tone_wildcard: ['Hopepunk', 'Grimdark', 'Mythic', 'Weird', 'Gothic', 'Heroic'],
};

export default function PortalPage() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [packets, setPackets] = useState<Packet[]>([]);
  const [prefs, setPrefs] = useState<Partial<BuilderPreferences>>({});
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadData() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      window.location.href = '/';
      return;
    }

    const [userRes, packetsRes] = await Promise.all([
      fetch('/api/preferences', { headers: { authorization: `Bearer ${session.access_token}` } }),
      fetch('/api/packets', { headers: { authorization: `Bearer ${session.access_token}` } }),
    ]);

    const userData = await supabase.from('users').select('*').eq('id', session.user.id).single();
    setUser(userData.data);

    const prefsData = await userRes.json();
    if (prefsData.preferences) setPrefs(prefsData.preferences);

    const packetsData = await packetsRes.json();
    setPackets(packetsData.packets ?? []);
    setLoading(false);
  }

  async function handleGenerate() {
    setGenerating(true);
    setMessage('');
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const canControl = user?.tier === 'cartographer' || user?.tier === 'architect' || user?.tier === 'founding_vault';

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(canControl ? { selections: prefs } : {}),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage(`World created: ${data.packet.worldName}`);
      await loadData();
    } else {
      setMessage(data.error ?? 'Generation failed.');
    }
    setGenerating(false);
  }

  async function savePrefs() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    await fetch('/api/preferences', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(prefs),
    });
    setMessage('Preferences saved.');
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <p className="text-muted font-cinzel tracking-widest">Loading your realm...</p>
    </div>
  );

  const canControl = user?.tier === 'cartographer' || user?.tier === 'architect' || user?.tier === 'founding_vault';
  const isFree = !user?.tier || user.tier === 'free';

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <header className="border-b" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-cinzel" style={{ color: 'var(--gold)' }}>Lore &amp; Legacy</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm px-3 py-1 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--gold)', border: '1px solid var(--border)' }}>
              {user?.tier?.replace('_', ' ').toUpperCase()}
            </span>
            <button
              onClick={() => supabase.auth.signOut().then(() => window.location.href = '/')}
              className="text-sm text-muted hover:text-muted"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-12">
        {/* Generate section */}
        <section>
          <h2 className="text-2xl mb-6" style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold)' }}>
            Generate a World
          </h2>

          {isFree ? (
            <div className="p-6 rounded border text-center" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
              <p className="text-muted mb-4">Upgrade your plan to generate worlds.</p>
              <a
                href="/"
                className="inline-block px-6 py-2 font-cinzel text-sm tracking-widest rounded"
                style={{ background: 'var(--gold)', color: 'var(--bg)' }}
              >
                View Plans
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {canControl && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(BUILDER_OPTIONS).map(([key, options]) => (
                    <div key={key}>
                      <label className="block text-xs font-cinzel tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
                        {key.replace('_', ' ').toUpperCase()}
                      </label>
                      <select
                        value={(prefs as Record<string, string>)[key] ?? ''}
                        onChange={(e) => setPrefs((p) => ({ ...p, [key]: e.target.value || null }))}
                        className="w-full px-3 py-2 rounded text-sm"
                        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text)' }}
                      >
                        <option value="">Worldsmith decides</option>
                        {options.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3 items-center flex-wrap">
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="px-8 py-3 font-cinzel tracking-widest text-sm rounded disabled:opacity-50"
                  style={{ background: 'var(--gold)', color: 'var(--bg)' }}
                >
                  {generating ? 'Forging World...' : 'Generate World'}
                </button>

                {canControl && (
                  <button
                    onClick={savePrefs}
                    className="px-5 py-3 font-cinzel tracking-widest text-xs rounded border"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                  >
                    Save Preferences
                  </button>
                )}

                {message && (
                  <p className="text-sm" style={{ color: message.includes('failed') || message.includes('limit') ? '#e05050' : 'var(--gold)' }}>
                    {message}
                  </p>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Packet archive */}
        <section>
          <h2 className="text-2xl mb-6" style={{ fontFamily: 'Cinzel, serif', color: 'var(--gold)' }}>
            Your Archive
          </h2>

          {packets.length === 0 ? (
            <p className="text-muted">No worlds yet. Generate your first one above.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {packets.map((p) => (
                <a
                  key={p.id}
                  href={`/worlds/${p.share_token}`}
                  className="block p-5 rounded border hover:border-gold transition-colors"
                  style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
                >
                  <p className="font-cinzel text-sm mb-1" style={{ color: 'var(--gold)' }}>{p.world_name}</p>
                  <p className="text-sm text-muted italic">{p.tagline}</p>
                  <p className="text-xs mt-3" style={{ color: 'var(--text-dim)' }}>
                    {p.genre} · {new Date(p.created_at).toLocaleDateString()}
                  </p>
                </a>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

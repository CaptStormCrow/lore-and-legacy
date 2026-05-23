import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { createServiceClient } from '@/lib/supabase/server';
import { generateWorldPacket, pickRandomGenre } from '@/lib/worldsmith';
import { getResend } from '@/lib/resend';
import type { Tier } from '@/types';

export async function POST(request: NextRequest) {
  // Verify cron secret
  const secret = request.headers.get('x-cron-secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const supabase = await createServiceClient();
  const started = Date.now();

  await supabase.from('agent_logs').insert({
    agent_id: 'oracle',
    level: 'info',
    message: 'Weekly cron started',
    metadata: { started_at: new Date().toISOString() },
  });

  // Pull all paid subscribers
  const { data: subscribers } = await supabase
    .from('users')
    .select('id, email, tier')
    .in('tier', ['wanderer', 'cartographer', 'architect', 'founding_vault']);

  if (!subscribers?.length) {
    await supabase.from('agent_logs').insert({
      agent_id: 'oracle',
      level: 'info',
      message: 'No subscribers to process',
    });
    return NextResponse.json({ processed: 0 });
  }

  // Load all preferences in one query
  const { data: allPrefs } = await supabase
    .from('builder_preferences')
    .select('*')
    .in('user_id', subscribers.map((s) => s.id));

  const prefMap = new Map(allPrefs?.map((p) => [p.user_id, p]) ?? []);

  let processed = 0;
  let failed = 0;

  for (const subscriber of subscribers) {
    // 2-second stagger between jobs
    if (processed > 0) {
      await new Promise((r) => setTimeout(r, 2000));
    }

    const tier = subscriber.tier as Tier;
    const prefs = prefMap.get(subscriber.id) ?? null;
    const generationCount = tier === 'architect' || tier === 'founding_vault' ? 3 : 1;

    for (let i = 0; i < generationCount; i++) {
      try {
        const genre = tier === 'wanderer' ? pickRandomGenre() : (prefs?.terrain ?? pickRandomGenre());
        const packet = await generateWorldPacket(genre, tier === 'wanderer' ? null : prefs);

        const { data: saved } = await supabase
          .from('packets')
          .insert({
            user_id: subscriber.id,
            world_name: packet.worldName,
            tagline: packet.tagline,
            regional_portrait: packet.regionalPortrait,
            factions: packet.factions,
            mystery_hook: packet.mysteryHook,
            npcs: packet.npcs,
            artifact_name: packet.artifactName,
            artifact_description: packet.artifactDescription,
            tone_aesthetic: packet.toneAesthetic,
            genre,
            builder_selections: tier === 'wanderer' ? null : prefs,
            prompt_version: 'v1.0',
            generation_source: 'weekly_cron',
          })
          .select('share_token')
          .single();

        // Send email
        await getResend().emails.send({
          from: process.env.RESEND_FROM_EMAIL!,
          to: subscriber.email,
          subject: `Your world has arrived: ${packet.worldName}`,
          html: buildPacketEmail(packet, saved?.share_token ?? ''),
        });

      } catch (err) {
        failed++;
        await supabase.from('agent_logs').insert({
          agent_id: 'forge',
          level: 'error',
          message: `Failed to generate for subscriber ${subscriber.id}`,
          metadata: { error: String(err), user_id: subscriber.id },
        });
      }
    }

    processed++;
  }

  const duration = Date.now() - started;

  await supabase.from('agent_logs').insert({
    agent_id: 'oracle',
    level: failed > 0 ? 'warning' : 'success',
    message: `Weekly cron complete: ${processed} processed, ${failed} failed`,
    metadata: { processed, failed, duration_ms: duration },
  });

  // Update brain state
  const { data: stats } = await supabase.from('dashboard_status').select('*').single();
  await supabase.from('brain_state').update({
    state: {
      last_updated: new Date().toISOString(),
      metrics: {
        total_subscribers: stats?.total_subscribers ?? 0,
        mrr: stats?.mrr ?? 0,
        churn_this_month: 0,
        generations_this_week: stats?.generations_this_week ?? 0,
        open_rate_last_email: 0,
      },
      open_tasks: [],
      decisions_made: [],
      known_issues: failed > 0 ? [`${failed} generation failures in last cron`] : [],
      weekly_goal: 'Reach first 10 subscribers',
    },
    updated_at: new Date().toISOString(),
  }).eq('id', 1);

  return NextResponse.json({ processed, failed, duration_ms: duration });
}

function buildPacketEmail(packet: { worldName: string; tagline: string; regionalPortrait: string }, shareToken: string): string {
  const url = `${process.env.NEXT_PUBLIC_URL}/worlds/${shareToken}`;
  return `
    <div style="background:#0d0a07;color:#e8dcc8;font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px 24px;">
      <h1 style="font-family:Georgia,serif;color:#c9a84c;font-size:28px;margin-bottom:8px;">${packet.worldName}</h1>
      <p style="color:#a09070;font-style:italic;margin-bottom:24px;">${packet.tagline}</p>
      <p style="line-height:1.7;margin-bottom:32px;">${packet.regionalPortrait}</p>
      <a href="${url}" style="display:inline-block;background:#c9a84c;color:#0d0a07;padding:12px 24px;text-decoration:none;font-weight:bold;border-radius:2px;">View Your World</a>
      <p style="color:#605040;font-size:12px;margin-top:40px;">Lore &amp; Legacy — worlds@loreandlegacy.com</p>
    </div>
  `;
}

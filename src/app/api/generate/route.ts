import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { createServiceClient } from '@/lib/supabase/server';
import { generateWorldPacket, pickRandomGenre } from '@/lib/worldsmith';
import { checkUsage } from '@/lib/usageCheck';
import type { Tier, BuilderSelections } from '@/types';

export async function POST(request: NextRequest) {
  const supabase = await createServiceClient();

  // Auth check via bearer token
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Load user tier
  const { data: profile } = await supabase
    .from('users')
    .select('tier')
    .eq('id', user.id)
    .single();

  const tier = (profile?.tier ?? 'free') as Tier;

  // Usage + rate limit check
  const usage = await checkUsage(supabase, user.id, tier);
  if (!usage.allowed) {
    return NextResponse.json({ error: usage.reason }, { status: 403 });
  }

  // Parse body
  const body = await request.json().catch(() => ({})) as {
    genre?: string;
    selections?: BuilderSelections;
  };
  const genre = body.genre ?? pickRandomGenre();
  const selections = body.selections ?? null;

  // Generate world (with one retry built into worldsmith)
  let packet;
  try {
    packet = await generateWorldPacket(genre, selections);
  } catch {
    await supabase.from('agent_logs').insert({
      agent_id: 'forge',
      level: 'error',
      message: 'World generation failed after retry',
      metadata: { user_id: user.id, genre },
    });
    return NextResponse.json(
      { error: 'World generation failed. Please try again shortly.' },
      { status: 503 }
    );
  }

  // Save packet
  const { data: saved, error: insertError } = await supabase
    .from('packets')
    .insert({
      user_id: user.id,
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
      builder_selections: selections,
      prompt_version: 'v1.0',
      generation_source: 'manual',
    })
    .select('id, share_token')
    .single();

  if (insertError || !saved) {
    return NextResponse.json({ error: 'Failed to save world.' }, { status: 500 });
  }

  // Increment weekly usage
  const weekStart = getMondayISO();
  const { data: existingUsage } = await supabase
    .from('usage_tracking')
    .select('generations_used')
    .eq('user_id', user.id)
    .eq('week_start', weekStart)
    .single();

  await supabase.from('usage_tracking').upsert({
    user_id: user.id,
    week_start: weekStart,
    tier_at_time: tier,
    generations_used: (existingUsage?.generations_used ?? 0) + 1,
  });

  // Log success
  await supabase.from('agent_logs').insert({
    agent_id: 'forge',
    level: 'success',
    message: `Generated world: ${packet.worldName}`,
    metadata: { user_id: user.id, genre, packet_id: saved.id },
  });

  return NextResponse.json({
    packet: { ...packet, id: saved.id },
    share_token: saved.share_token,
  });
}

function getMondayISO(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split('T')[0];
}

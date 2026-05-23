import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { createServiceClient } from '@/lib/supabase/server';
import { z } from 'zod';

const schema = z.object({
  terrain: z.string().nullable().optional(),
  power_structure: z.string().nullable().optional(),
  primary_threat: z.string().nullable().optional(),
  dominant_races: z.string().nullable().optional(),
  monster_type: z.string().nullable().optional(),
  tone_wildcard: z.string().nullable().optional(),
});

async function getUser(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;
  const supabase = await createServiceClient();
  const { data: { user } } = await supabase.auth.getUser(token);
  return user ? { user, supabase } : null;
}

export async function GET(request: NextRequest) {
  const auth = await getUser(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data } = await auth.supabase
    .from('builder_preferences')
    .select('*')
    .eq('user_id', auth.user.id)
    .single();

  return NextResponse.json({ preferences: data ?? null });
}

export async function PUT(request: NextRequest) {
  const auth = await getUser(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { error } = await auth.supabase.from('builder_preferences').upsert({
    user_id: auth.user.id,
    ...parsed.data,
    updated_at: new Date().toISOString(),
  });

  if (error) return NextResponse.json({ error: 'Failed to save preferences' }, { status: 500 });

  return NextResponse.json({ success: true });
}

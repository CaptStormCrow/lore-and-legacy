import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { createServiceClient } from '@/lib/supabase/server';
import { z } from 'zod';

const schema = z.object({
  brief: z.string().min(20).max(2000),
});

export async function POST(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = await createServiceClient();
  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Must be architect tier
  const { data: profile } = await supabase
    .from('users')
    .select('tier')
    .eq('id', user.id)
    .single();

  if (profile?.tier !== 'architect' && profile?.tier !== 'founding_vault') {
    return NextResponse.json(
      { error: 'Commissions are available to Architect subscribers only.' },
      { status: 403 }
    );
  }

  // Enforce 1 per calendar month
  const monthYear = new Date().toISOString().slice(0, 7); // e.g. '2026-05'
  const { count } = await supabase
    .from('commissions')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('month_year', monthYear)
    .neq('status', 'cancelled');

  if ((count ?? 0) >= 1) {
    return NextResponse.json(
      { error: 'You have already submitted a commission this month.' },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Brief must be 20–2000 characters.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('commissions')
    .insert({
      user_id: user.id,
      brief: parsed.data.brief,
      month_year: monthYear,
    })
    .select('id')
    .single();

  if (error) return NextResponse.json({ error: 'Failed to submit commission.' }, { status: 500 });

  await supabase.from('agent_logs').insert({
    agent_id: 'herald',
    level: 'info',
    message: `Commission submitted by ${user.id}`,
    metadata: { commission_id: data.id, month_year: monthYear },
  });

  return NextResponse.json({ id: data.id });
}

export async function GET(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = await createServiceClient();
  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data } = await supabase
    .from('commissions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return NextResponse.json({ commissions: data ?? [] });
}

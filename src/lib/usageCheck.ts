import type { SupabaseClient } from '@supabase/supabase-js';
import type { Tier } from '@/types';

const TIER_LIMITS: Record<Tier, number> = {
  free: 0,
  wanderer: 1,
  cartographer: 1,
  architect: 3,
  founding_vault: 3,
};

function getMondayOfWeek(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split('T')[0];
}

export async function checkUsage(
  supabase: SupabaseClient,
  userId: string,
  tier: Tier
): Promise<{ allowed: boolean; reason?: string }> {
  if (tier === 'free') {
    return { allowed: false, reason: 'Upgrade your plan to generate worlds.' };
  }

  const weekStart = getMondayOfWeek(new Date());
  const limit = TIER_LIMITS[tier];

  // Check weekly usage
  const { data: usage } = await supabase
    .from('usage_tracking')
    .select('generations_used')
    .eq('user_id', userId)
    .eq('week_start', weekStart)
    .single();

  const used = usage?.generations_used ?? 0;

  if (used >= limit) {
    return {
      allowed: false,
      reason: `Weekly limit reached (${limit} generation${limit === 1 ? '' : 's'} per week on your plan).`,
    };
  }

  // Check hourly rate limit (10/hour)
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from('packets')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', oneHourAgo);

  if ((count ?? 0) >= 10) {
    return { allowed: false, reason: 'Rate limit reached. Please wait before generating again.' };
  }

  return { allowed: true };
}

export async function incrementUsage(
  supabase: SupabaseClient,
  userId: string,
  tier: Tier
): Promise<void> {
  const weekStart = getMondayOfWeek(new Date());

  const { data: existing } = await supabase
    .from('usage_tracking')
    .select('generations_used')
    .eq('user_id', userId)
    .eq('week_start', weekStart)
    .single();

  const newCount = (existing?.generations_used ?? 0) + 1;

  await supabase.from('usage_tracking').upsert(
    {
      user_id: userId,
      week_start: weekStart,
      tier_at_time: tier,
      generations_used: newCount,
    },
    { onConflict: 'user_id,week_start' }
  );
}

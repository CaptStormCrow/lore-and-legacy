import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getStripe } from '@/lib/stripe';
import { createServiceClient } from '@/lib/supabase/server';
import { z } from 'zod';

const schema = z.object({
  tier: z.enum(['wanderer', 'cartographer', 'architect', 'founding_vault']),
  userId: z.string().uuid(),
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { tier, userId, email } = parsed.data;

  const PRICE_MAP: Record<string, string | undefined> = {
    wanderer: process.env.STRIPE_PRICE_WANDERER,
    cartographer: process.env.STRIPE_PRICE_CARTOGRAPHER,
    architect: process.env.STRIPE_PRICE_ARCHITECT,
    founding_vault: process.env.STRIPE_PRICE_FOUNDING_VAULT,
  };

  const priceId = PRICE_MAP[tier];

  if (!priceId) {
    return NextResponse.json({ error: 'Price not configured' }, { status: 500 });
  }

  const supabase = await createServiceClient();
  const { data: user } = await supabase
    .from('users')
    .select('stripe_customer_id')
    .eq('id', userId)
    .single();

  let customerId = user?.stripe_customer_id;

  if (!customerId) {
    const customer = await getStripe().customers.create({
      email,
      metadata: { supabase_user_id: userId },
    });
    customerId = customer.id;
    await supabase
      .from('users')
      .update({ stripe_customer_id: customerId })
      .eq('id', userId);
  }

  const isOneTime = tier === 'founding_vault';

  const session = await getStripe().checkout.sessions.create({
    customer: customerId,
    mode: isOneTime ? 'payment' : 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_URL}/portal?subscribed=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/?cancelled=true`,
    metadata: { user_id: userId, tier },
  });

  return NextResponse.json({ url: session.url });
}

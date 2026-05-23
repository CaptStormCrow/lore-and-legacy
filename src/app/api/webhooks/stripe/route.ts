import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getStripe } from '@/lib/stripe';
import { createServiceClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = await createServiceClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;
      const tier = session.metadata?.tier;

      if (!userId || !tier) break;

      await supabase.from('users').update({ tier }).eq('id', userId);

      if (session.subscription) {
        await supabase.from('subscriptions').upsert({
          user_id: userId,
          stripe_subscription_id: session.subscription as string,
          stripe_price_id: session.metadata?.price_id,
          status: 'active',
        });
      }

      await supabase.from('agent_logs').insert({
        agent_id: 'ledger',
        level: 'success',
        message: `New ${tier} subscriber: ${userId}`,
        metadata: { user_id: userId, tier, session_id: session.id },
      });
      break;
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription & {
        current_period_end?: number;
        cancel_at_period_end?: boolean;
      };
      const status = sub.status as string;

      await supabase
        .from('subscriptions')
        .update({
          status: mapStripeStatus(status),
          current_period_end: sub.current_period_end
            ? new Date(sub.current_period_end * 1000).toISOString()
            : null,
          cancel_at_period_end: sub.cancel_at_period_end ?? false,
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', sub.id);

      await supabase.from('agent_logs').insert({
        agent_id: 'ledger',
        level: 'info',
        message: `Subscription updated: ${sub.id} → ${status}`,
        metadata: { subscription_id: sub.id, status },
      });
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;

      await supabase
        .from('subscriptions')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('stripe_subscription_id', sub.id);

      // Downgrade user to free (not delete)
      const { data: subRecord } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('stripe_subscription_id', sub.id)
        .single();

      if (subRecord?.user_id) {
        await supabase
          .from('users')
          .update({ tier: 'free' })
          .eq('id', subRecord.user_id);
      }

      await supabase.from('agent_logs').insert({
        agent_id: 'ledger',
        level: 'warning',
        message: `Subscription cancelled: ${sub.id}`,
        metadata: { subscription_id: sub.id },
      });
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice & { subscription?: string | { id: string } };
      const subscriptionId = typeof invoice.subscription === 'string'
        ? invoice.subscription
        : (invoice.subscription as { id: string } | undefined)?.id;

      if (subscriptionId) {
        await supabase
          .from('subscriptions')
          .update({ status: 'past_due', updated_at: new Date().toISOString() })
          .eq('stripe_subscription_id', subscriptionId);
      }

      await supabase.from('agent_logs').insert({
        agent_id: 'ledger',
        level: 'error',
        message: `Payment failed for invoice: ${invoice.id}`,
        metadata: { invoice_id: invoice.id, subscription_id: subscriptionId },
      });
      break;
    }

    case 'customer.subscription.paused': {
      const sub = event.data.object as Stripe.Subscription;

      await supabase
        .from('subscriptions')
        .update({ status: 'paused', updated_at: new Date().toISOString() })
        .eq('stripe_subscription_id', sub.id);

      await supabase.from('agent_logs').insert({
        agent_id: 'ledger',
        level: 'info',
        message: `Subscription paused: ${sub.id}`,
        metadata: { subscription_id: sub.id },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}

function mapStripeStatus(status: string): string {
  const map: Record<string, string> = {
    active: 'active',
    canceled: 'cancelled',
    past_due: 'past_due',
    paused: 'paused',
    incomplete: 'incomplete',
    incomplete_expired: 'cancelled',
    trialing: 'active',
    unpaid: 'past_due',
  };
  return map[status] ?? 'active';
}

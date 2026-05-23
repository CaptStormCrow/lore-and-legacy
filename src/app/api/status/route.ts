import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { createServiceClient } from '@/lib/supabase/server';

const AGENT_IDS = ['oracle', 'vex', 'ledger', 'cipher', 'axiom', 'herald', 'forge'];

export async function GET() {
  const supabase = await createServiceClient();

  const [statusResult, agentStatusResult, brainResult, ...logsResults] = await Promise.all([
    supabase.from('dashboard_status').select('*').single(),
    supabase.from('agent_status').select('*'),
    supabase.from('brain_state').select('*').eq('id', 1).single(),
    ...AGENT_IDS.map((agentId) =>
      supabase
        .from('agent_logs')
        .select('*')
        .eq('agent_id', agentId)
        .order('created_at', { ascending: false })
        .limit(5)
    ),
  ]);

  const agentLogs: Record<string, unknown[]> = {};
  AGENT_IDS.forEach((agentId, i) => {
    agentLogs[agentId] = logsResults[i].data ?? [];
  });

  return NextResponse.json({
    dashboard: statusResult.data,
    agents: agentStatusResult.data,
    brain: brainResult.data,
    logs: agentLogs,
    timestamp: new Date().toISOString(),
  });
}

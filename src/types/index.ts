export type Tier = 'free' | 'wanderer' | 'cartographer' | 'architect' | 'founding_vault';

export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due' | 'paused' | 'incomplete';

export type AgentId = 'oracle' | 'vex' | 'ledger' | 'cipher' | 'axiom' | 'herald' | 'forge';

export type AgentLogLevel = 'info' | 'success' | 'warning' | 'error';

export type GenerationSource = 'manual' | 'weekly_cron' | 'commission';

export type CommissionStatus = 'pending' | 'in_progress' | 'delivered' | 'cancelled';

export interface User {
  id: string;
  email: string;
  tier: Tier;
  tier_expires_at: string | null;
  stripe_customer_id: string | null;
  referral_code: string;
  referred_by: string | null;
  bonus_generations: number;
  created_at: string;
  last_active_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  status: SubscriptionStatus;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  pause_resumes_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Faction {
  name: string;
  description: string;
}

export interface NPC {
  name: string;
  seed: string;
}

export interface Packet {
  id: string;
  user_id: string;
  world_name: string;
  tagline: string | null;
  regional_portrait: string | null;
  factions: Faction[] | null;
  mystery_hook: string | null;
  npcs: NPC[] | null;
  artifact_name: string | null;
  artifact_description: string | null;
  tone_aesthetic: string | null;
  genre: string | null;
  builder_selections: BuilderSelections | null;
  prompt_version: string;
  share_token: string;
  view_count: number;
  generation_source: GenerationSource;
  created_at: string;
}

export interface BuilderPreferences {
  user_id: string;
  terrain: string | null;
  power_structure: string | null;
  primary_threat: string | null;
  dominant_races: string | null;
  monster_type: string | null;
  tone_wildcard: string | null;
  updated_at: string;
}

export type BuilderSelections = Omit<BuilderPreferences, 'user_id' | 'updated_at'>;

export interface Commission {
  id: string;
  user_id: string;
  brief: string;
  status: CommissionStatus;
  delivered_packet_id: string | null;
  month_year: string;
  created_at: string;
  updated_at: string;
}

export interface AgentLog {
  id: string;
  agent_id: AgentId;
  level: AgentLogLevel;
  message: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface BrainStateMetrics {
  total_subscribers: number;
  mrr: number;
  churn_this_month: number;
  generations_this_week: number;
  open_rate_last_email: number;
}

export interface BrainStateData {
  last_updated: string | null;
  metrics: BrainStateMetrics;
  open_tasks: string[];
  decisions_made: string[];
  known_issues: string[];
  weekly_goal: string;
}

export interface BrainState {
  id: number;
  state: BrainStateData;
  updated_at: string;
}

export interface DashboardStatus {
  total_subscribers: number;
  wanderer_count: number;
  cartographer_count: number;
  architect_count: number;
  founding_vault_count: number;
  mrr: number;
  generations_this_week: number;
  unconverted_leads: number;
  as_of: string;
}

export interface AgentStatus {
  agent_id: AgentId;
  level: AgentLogLevel;
  message: string;
  created_at: string;
}

export interface WorldPacket {
  worldName: string;
  tagline: string;
  regionalPortrait: string;
  factions: Faction[];
  mysteryHook: string;
  npcs: NPC[];
  artifactName: string;
  artifactDescription: string;
  toneAesthetic: string;
}

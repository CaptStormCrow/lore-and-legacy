import { getAnthropicClient } from './anthropic';
import type { WorldPacket, BuilderSelections } from '@/types';

const WANDERER_GENRES = [
  'Dark Fantasy',
  'Cosmic Horror',
  'Dying Earth',
  'Grim Fairy Tale',
  'Dieselpunk',
  'Ocean Fantasy',
];

export function pickRandomGenre(): string {
  return WANDERER_GENRES[Math.floor(Math.random() * WANDERER_GENRES.length)];
}

function buildBrief(genre: string, selections?: BuilderSelections | null): string {
  if (!selections) {
    return `Genre: ${genre}. Let the Worldsmith decide everything else.`;
  }

  const parts: string[] = [`Genre: ${genre}.`];
  if (selections.terrain) parts.push(`Terrain: ${selections.terrain}.`);
  if (selections.power_structure) parts.push(`Power structure: ${selections.power_structure}.`);
  if (selections.primary_threat) parts.push(`Primary threat: ${selections.primary_threat}.`);
  if (selections.dominant_races) parts.push(`Dominant peoples: ${selections.dominant_races}.`);
  if (selections.monster_type) parts.push(`Monster type: ${selections.monster_type}.`);
  if (selections.tone_wildcard) parts.push(`Tone wildcard: ${selections.tone_wildcard}.`);

  return parts.join(' ');
}

export async function generateWorldPacket(
  genre: string,
  selections?: BuilderSelections | null
): Promise<WorldPacket> {
  const brief = buildBrief(genre, selections);

  const prompt = `You are the Worldsmith. Generate a World Packet. ${brief}

CRITICAL: Return ONLY raw valid JSON. No markdown. No backticks.
No preamble. JSON must be complete and properly closed.
Keep ALL string values concise — max 2 sentences each.

{"worldName":"striking region name","tagline":"one evocative sentence under 10 words",
"regionalPortrait":"2 vivid atmospheric sentences with sensory detail.",
"factions":[
  {"name":"faction name","description":"2 sentences: who they are and their hidden tension."},
  {"name":"faction name","description":"2 sentences."},
  {"name":"faction name","description":"2 sentences."}
],
"mysteryHook":"2 strange unanswered sentences that haunt the world.",
"npcs":[
  {"name":"Full Name","seed":"8-word personality"},
  {"name":"Full Name","seed":"8-word personality"},
  {"name":"Full Name","seed":"8-word personality"},
  {"name":"Full Name","seed":"8-word personality"},
  {"name":"Full Name","seed":"8-word personality"}
],
"artifactName":"name",
"artifactDescription":"2 sentences: appearance and one mechanical suggestion.",
"toneAesthetic":"2 sentences: mood and 2 real-world influences."}`;

  const attempt = async (): Promise<WorldPacket> => {
    const message = await getAnthropicClient().messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    return JSON.parse(text) as WorldPacket;
  };

  try {
    return await attempt();
  } catch {
    await new Promise((r) => setTimeout(r, 2000));
    return await attempt();
  }
}

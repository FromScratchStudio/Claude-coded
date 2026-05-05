import type { AiMessage, AiProviderId } from "../types";

// ─── Provider definitions ─────────────────────────────────────────────────────

export type AiApiFormat = "openai" | "anthropic" | "gemini";

export interface AiProviderDef {
  id: AiProviderId;
  label: string;
  baseUrl: string;
  defaultModel: string;
  models: string[];
  requiresApiKey: boolean;
  apiFormat: AiApiFormat;
}

export const AI_PROVIDERS: AiProviderDef[] = [
  {
    id: "openai",
    label: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    defaultModel: "gpt-4o-mini",
    models: ["gpt-4o-mini", "gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo", "o1-mini"],
    requiresApiKey: true,
    apiFormat: "openai",
  },
  {
    id: "anthropic",
    label: "Claude (Anthropic)",
    baseUrl: "https://api.anthropic.com",
    defaultModel: "claude-3-5-sonnet-20241022",
    models: [
      "claude-3-5-sonnet-20241022",
      "claude-3-5-haiku-20241022",
      "claude-3-opus-20240229",
      "claude-3-haiku-20240307",
    ],
    requiresApiKey: true,
    apiFormat: "anthropic",
  },
  {
    id: "gemini",
    label: "Gemini (Google)",
    baseUrl: "https://generativelanguage.googleapis.com",
    defaultModel: "gemini-1.5-flash",
    models: ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash-exp"],
    requiresApiKey: true,
    apiFormat: "gemini",
  },
  {
    id: "ollama",
    label: "Ollama (local)",
    baseUrl: "http://localhost:11434/v1",
    defaultModel: "llama3.2",
    models: ["llama3.2", "llama3.1", "mistral", "phi3", "codellama", "gemma2", "qwen2.5"],
    requiresApiKey: false,
    apiFormat: "openai",
  },
  {
    id: "custom",
    label: "Personnalisé (compatible OpenAI)",
    baseUrl: "",
    defaultModel: "",
    models: [],
    requiresApiKey: true,
    apiFormat: "openai",
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AiConfig {
  provider: AiProviderId;
  apiKey: string;
  baseUrl: string;
  model: string;
  systemPrompt: string;
}

// Minimal slice of StoreState needed for the snapshot
export interface SnapshotState {
  projects: Array<{ name: string; status: string; priority: string; progress: number; note: string }>;
  chapters: Array<{ title: string; stage: number; gates: boolean[]; hook: string }>;
  workflowStages: Array<{ id: number; label: string; fullName: string }>;
  ideas: Array<{ text: string; stage: string; source: string }>;
  kpiDefs: Array<{ key: string; label: string; target3m: number; target12m: number; unit: string }>;
  kpiValues: Record<string, number>;
  quarter: { q: string; plp: string; arc: string; amplification: string; zonesRouges: string; regleUnique: string };
  weeklyRetros: Array<{ weekKey: string; energyScore: number; pleasureScore: number; accomplished: string; blockers: string; learnings: string; nextWeekIntent: string }>;
  degradedMode: string | null;
  degradedModes: Array<{ id: string; label: string; rules: string[] }>;
  principles: Array<{ n: string; text: string }>;
  phases: Array<{ id: number; label: string; name: string; tasks: Array<{ text: string; done: boolean }> }>;
  energy: number;
  plaisir: number;
}

// ─── Context snapshot builder ─────────────────────────────────────────────────

const SNAPSHOT_MAX_CHARS = 4000;

export function buildContextSnapshot(s: SnapshotState): string {
  const raw = buildContextSnapshotRaw(s);
  if (raw.length <= SNAPSHOT_MAX_CHARS) return raw;
  return raw.slice(0, SNAPSHOT_MAX_CHARS) + "\n\n[Snapshot du tableau de bord tronqué pour longueur]";
}

function buildContextSnapshotRaw(s: SnapshotState): string {
  const lines: string[] = [];

  lines.push("Tableau de bord : STRATEX Artiste");
  lines.push(`État actuel — Énergie: ${s.energy}/10 · Plaisir: ${s.plaisir}/10`);
  lines.push("");

  // Quarter
  if (s.quarter.plp || s.quarter.arc) {
    lines.push("## Trimestre en cours");
    if (s.quarter.q) lines.push(`Période: ${s.quarter.q}`);
    if (s.quarter.plp) lines.push(`PLP (Plan Live Performance): ${s.quarter.plp}`);
    if (s.quarter.arc) lines.push(`ARC (focus): ${s.quarter.arc}`);
    if (s.quarter.amplification) lines.push(`Amplification: ${s.quarter.amplification}`);
    if (s.quarter.zonesRouges) lines.push(`Zones rouges: ${s.quarter.zonesRouges}`);
    if (s.quarter.regleUnique) lines.push(`Règle unique: ${s.quarter.regleUnique}`);
    lines.push("");
  }

  // Active degraded mode
  if (s.degradedMode) {
    const mode = s.degradedModes.find((m) => m.id === s.degradedMode);
    if (mode) {
      lines.push(`## Mode actif: ${mode.label}`);
      if (mode.rules.length > 0) lines.push(`Règles: ${mode.rules.join(" | ")}`);
      lines.push("");
    }
  }

  // Projects
  const activeProjects = s.projects.filter((p) => p.status === "active");
  const pendingProjects = s.projects.filter((p) => p.status === "pending");
  const backlogProjects = s.projects.filter((p) => p.status === "backlog");

  if (s.projects.length > 0) {
    lines.push("## Projets");
    if (activeProjects.length > 0) {
      lines.push(`Actifs (${activeProjects.length}):`);
      for (const p of activeProjects) {
        lines.push(`  - ${p.name} | priorité: ${p.priority} | avancement: ${p.progress}%${p.note ? ` | ${p.note}` : ""}`);
      }
    }
    if (pendingProjects.length > 0) {
      lines.push(`En attente (${pendingProjects.length}): ${pendingProjects.map((p) => p.name).join(", ")}`);
    }
    if (backlogProjects.length > 0) {
      lines.push(`Backlog (${backlogProjects.length}): ${backlogProjects.map((p) => p.name).join(", ")}`);
    }
    lines.push("");
  }

  // Chapter pipeline
  if (s.chapters.length > 0) {
    lines.push("## Pipeline de chapitres");
    for (const item of s.chapters) {
      const stage = s.workflowStages.find((ws) => ws.id === item.stage);
      const stageLabel = stage ? stage.label : `Étape ${item.stage}`;
      const gatesTotal = item.gates.length;
      const gatesDone = item.gates.filter(Boolean).length;
      lines.push(`  - "${item.title}" | ${stageLabel} | portes: ${gatesDone}/${gatesTotal}${item.hook ? ` | ${item.hook}` : ""}`);
    }
    lines.push("");
  }

  // Ideas
  if (s.ideas.length > 0) {
    const rawIdeas = s.ideas.filter((i) => i.stage === "raw");
    const sortedIdeas = s.ideas.filter((i) => i.stage === "sorted");
    const selectedIdeas = s.ideas.filter((i) => i.stage === "selected");
    lines.push(`## Idées (${s.ideas.length} au total)`);
    if (selectedIdeas.length > 0) {
      lines.push(`Retenues (${selectedIdeas.length}): ${selectedIdeas.map((i) => i.text).slice(0, 5).join(" | ")}`);
    }
    if (sortedIdeas.length > 0) {
      lines.push(`Triées (${sortedIdeas.length}): ${sortedIdeas.map((i) => i.text).slice(0, 5).join(" | ")}`);
    }
    if (rawIdeas.length > 0) {
      lines.push(`Brutes/non traitées (${rawIdeas.length})`);
    }
    lines.push("");
  }

  // KPIs
  if (s.kpiDefs.length > 0) {
    lines.push("## KPIs");
    for (const def of s.kpiDefs.slice(0, 8)) {
      const current = s.kpiValues[def.key] ?? 0;
      const pct = def.target3m > 0 ? Math.round((current / def.target3m) * 100) : null;
      const pctStr = pct !== null ? `${pct}%` : "—";
      lines.push(`  - ${def.label}: ${current}${def.unit} (objectif 3m: ${def.target3m}${def.unit}, à ${pctStr})`);
    }
    lines.push("");
  }

  // Phases
  const activePhaseTasks = s.phases.flatMap((p) =>
    p.tasks.filter((t) => !t.done).map((t) => ({ phase: p.label, task: t.text }))
  );
  if (activePhaseTasks.length > 0) {
    lines.push("## Tâches de phase en attente (extrait)");
    for (const t of activePhaseTasks.slice(0, 6)) {
      lines.push(`  - [${t.phase}] ${t.task}`);
    }
    lines.push("");
  }

  // Recent retrospectives
  const recentRetros = [...s.weeklyRetros]
    .sort((a, b) => b.weekKey.localeCompare(a.weekKey))
    .slice(0, 2);
  if (recentRetros.length > 0) {
    lines.push("## Rétrospectives récentes");
    for (const r of recentRetros) {
      lines.push(`Semaine ${r.weekKey}: énergie ${r.energyScore}/10 · plaisir ${r.pleasureScore}/10`);
      if (r.accomplished) lines.push(`  Accompli: ${r.accomplished}`);
      if (r.blockers) lines.push(`  Blocages: ${r.blockers}`);
      if (r.nextWeekIntent) lines.push(`  Intention semaine suivante: ${r.nextWeekIntent}`);
    }
    lines.push("");
  }

  // Top principles
  if (s.principles.length > 0) {
    lines.push("## Principes clés (extrait)");
    for (const p of s.principles.slice(0, 3)) {
      lines.push(`  - ${p.text}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

// ─── Markdown renderer ────────────────────────────────────────────────────────

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function renderMarkdown(text: string, headingColor: string): string {
  const codeBlocks: string[] = [];
  let processed = text.replace(/```[\s\S]*?```/g, (match) => {
    const inner = match.slice(3, -3).replace(/^[^\n]*\n/, "");
    const placeholder = `\x00CODEBLOCK${codeBlocks.length}\x00`;
    codeBlocks.push(
      `<pre style="background:#06080c;border:1px solid #1f2535;border-radius:6px;padding:0.75rem;overflow-x:auto;font-family:monospace;font-size:0.82rem;margin:0.5rem 0">${escapeHtml(inner)}</pre>`
    );
    return placeholder;
  });

  processed = escapeHtml(processed);

  return processed
    .replace(/`([^`]+)`/g, (_m, code) =>
      `<code style="background:#06080c;border:1px solid #1f2535;border-radius:3px;padding:1px 5px;font-family:monospace;font-size:0.85em">${escapeHtml(code)}</code>`
    )
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/^### (.+)$/gm, `<div style="font-weight:700;font-size:0.92rem;margin:0.75rem 0 0.25rem;color:${headingColor}">$1</div>`)
    .replace(/^## (.+)$/gm, `<div style="font-weight:700;font-size:0.98rem;margin:0.75rem 0 0.25rem;color:${headingColor}">$1</div>`)
    .replace(/^# (.+)$/gm, `<div style="font-weight:700;font-size:1.05rem;margin:0.75rem 0 0.25rem;color:${headingColor}">$1</div>`)
    .replace(/^[-*] (.+)$/gm, `<div style="padding-left:1.25rem;margin:0.15rem 0">· $1</div>`)
    .replace(/^\d+\. (.+)$/gm, `<div style="padding-left:1.25rem;margin:0.15rem 0">$1</div>`)
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, "<br/>")
    .replace(/\x00CODEBLOCK(\d+)\x00/g, (_m, i) => codeBlocks[Number(i)]);
}

// ─── Streaming API call ───────────────────────────────────────────────────────

export async function* streamAiResponse(
  messages: AiMessage[],
  config: AiConfig,
  signal?: AbortSignal
): AsyncGenerator<string> {
  const providerDef = AI_PROVIDERS.find((p) => p.id === config.provider);
  const format: AiApiFormat = providerDef?.apiFormat ?? "openai";

  if (format === "anthropic") {
    yield* streamAnthropic(messages, config, signal);
  } else if (format === "gemini") {
    yield* streamGemini(messages, config, signal);
  } else {
    yield* streamOpenAiCompat(messages, config, signal);
  }
}

// ─── OpenAI-compatible streaming ─────────────────────────────────────────────

async function* streamOpenAiCompat(
  messages: AiMessage[],
  config: AiConfig,
  signal?: AbortSignal
): AsyncGenerator<string> {
  const baseUrl = config.baseUrl.replace(/\/$/, "");

  const apiMessages = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({ role: m.role, content: m.content }));

  const systemMsg = messages.find((m) => m.role === "system");
  const payload = {
    model: config.model,
    messages: systemMsg
      ? [{ role: "system", content: systemMsg.content }, ...apiMessages]
      : apiMessages,
    stream: true,
    max_tokens: 1024,
  };

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {}),
    },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(`Erreur API ${response.status}: ${errorText}`);
  }

  yield* readSseStream(response, (json) => {
    const choices = (json as { choices?: Array<{ delta?: { content?: unknown } }> }).choices;
    const delta = choices?.[0]?.delta?.content;
    return typeof delta === "string" ? delta : null;
  });
}

// ─── Anthropic (Claude) streaming ────────────────────────────────────────────

async function* streamAnthropic(
  messages: AiMessage[],
  config: AiConfig,
  signal?: AbortSignal
): AsyncGenerator<string> {
  const baseUrl = config.baseUrl.replace(/\/$/, "");

  const systemMsg = messages.find((m) => m.role === "system");
  const apiMessages = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

  const payload: Record<string, unknown> = {
    model: config.model,
    max_tokens: 1024,
    messages: apiMessages,
    stream: true,
  };
  if (systemMsg) payload.system = systemMsg.content;

  const response = await fetch(`${baseUrl}/v1/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": config.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(`Erreur API ${response.status}: ${errorText}`);
  }

  yield* readSseStream(response, (json) => {
    const typed = json as { type?: string; delta?: { type?: string; text?: unknown } };
    if (typed.type === "content_block_delta" && typed.delta?.type === "text_delta") {
      return typeof typed.delta.text === "string" ? typed.delta.text : null;
    }
    return null;
  });
}

// ─── Gemini streaming ─────────────────────────────────────────────────────────

async function* streamGemini(
  messages: AiMessage[],
  config: AiConfig,
  signal?: AbortSignal
): AsyncGenerator<string> {
  const baseUrl = config.baseUrl.replace(/\/$/, "");

  const systemMsg = messages.find((m) => m.role === "system");
  const contents = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

  const payload: Record<string, unknown> = { contents };
  if (systemMsg) {
    payload.systemInstruction = { parts: [{ text: systemMsg.content }] };
  }

  const url =
    `${baseUrl}/v1beta/models/${encodeURIComponent(config.model)}:streamGenerateContent` +
    `?key=${encodeURIComponent(config.apiKey)}&alt=sse`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(`Erreur API ${response.status}: ${errorText}`);
  }

  yield* readSseStream(response, (json) => {
    type GeminiChunk = {
      candidates?: Array<{ content?: { parts?: Array<{ text?: unknown }> } }>;
    };
    const typed = json as GeminiChunk;
    const text = typed.candidates?.[0]?.content?.parts?.[0]?.text;
    return typeof text === "string" ? text : null;
  });
}

// ─── SSE reader helper ────────────────────────────────────────────────────────

async function* readSseStream(
  response: Response,
  extract: (json: Record<string, unknown>) => string | null
): AsyncGenerator<string> {
  const reader = response.body?.getReader();
  if (!reader) throw new Error("Pas de corps de réponse");

  const decoder = new TextDecoder();
  let buffer = "";

  function* parseLines(chunk: string): Generator<string> {
    const lines = chunk.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed === "data: [DONE]") continue;
      if (!trimmed.startsWith("data: ")) continue;
      try {
        const json = JSON.parse(trimmed.slice(6)) as Record<string, unknown>;
        const delta = extract(json);
        if (delta !== null && delta.length > 0) yield delta;
      } catch {
        // skip malformed SSE lines
      }
    }
  }

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    yield* parseLines(lines.join("\n"));
  }

  yield* parseLines(buffer);
}

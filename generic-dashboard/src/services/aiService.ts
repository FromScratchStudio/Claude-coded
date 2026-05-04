import type { AiMessage } from "../types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AiConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
  systemPrompt: string;
}

// Minimal slice of StoreState we need for the snapshot
export interface SnapshotState {
  projects: Array<{ name: string; status: string; priority: string; progress: number; note: string; tags: string[] }>;
  pipelineItems: Array<{ title: string; stage: number; gates: boolean[]; hook: string; tags: string[] }>;
  workflowStages: Array<{ id: number; label: string; fullName: string }>;
  ideas: Array<{ text: string; stage: string; tags: string[] }>;
  kpiDefs: Array<{ key: string; label: string; target3m: number; target12m: number; unit: string }>;
  kpiValues: Record<string, number>;
  quarter: { q: string; goal: string; theme: string; amplification: string; redZones: string };
  weeklyRetros: Array<{ weekKey: string; energyScore: number; satisfactionScore: number; accomplished: string; blockers: string; learnings: string; nextWeekIntent: string }>;
  operationalMode: string | null;
  operationalModes: Array<{ id: string; label: string; rules: string[] }>;
  principles: Array<{ n: string; text: string }>;
  phases: Array<{ id: number; label: string; name: string; tasks: Array<{ text: string; done: boolean }> }>;
  energy: number;
  satisfaction: number;
  appConfig: { appName: string; energyLabel: string; satisfactionLabel: string };
}

// ─── Context snapshot builder ─────────────────────────────────────────────────

export function buildContextSnapshot(s: SnapshotState): string {
  const lines: string[] = [];

  lines.push(`Dashboard: ${s.appConfig.appName}`);
  lines.push(`Current state — ${s.appConfig.energyLabel}: ${s.energy}/10 · ${s.appConfig.satisfactionLabel}: ${s.satisfaction}/10`);
  lines.push("");

  // Quarter
  if (s.quarter.goal || s.quarter.theme) {
    lines.push("## Current Quarter");
    if (s.quarter.q) lines.push(`Period: ${s.quarter.q}`);
    if (s.quarter.goal) lines.push(`Goal: ${s.quarter.goal}`);
    if (s.quarter.theme) lines.push(`Theme: ${s.quarter.theme}`);
    if (s.quarter.amplification) lines.push(`Amplification: ${s.quarter.amplification}`);
    if (s.quarter.redZones) lines.push(`Red zones: ${s.quarter.redZones}`);
    lines.push("");
  }

  // Active operational mode
  if (s.operationalMode) {
    const mode = s.operationalModes.find((m) => m.id === s.operationalMode);
    if (mode) {
      lines.push(`## Active Mode: ${mode.label}`);
      if (mode.rules.length > 0) lines.push(`Rules: ${mode.rules.join(" | ")}`);
      lines.push("");
    }
  }

  // Projects
  const activeProjects = s.projects.filter((p) => p.status === "active");
  const pendingProjects = s.projects.filter((p) => p.status === "pending");
  const backlogProjects = s.projects.filter((p) => p.status === "backlog");

  if (s.projects.length > 0) {
    lines.push("## Projects");
    if (activeProjects.length > 0) {
      lines.push(`Active (${activeProjects.length}):`);
      for (const p of activeProjects) {
        const tagsStr = p.tags.length > 0 ? ` [${p.tags.join(", ")}]` : "";
        lines.push(`  - ${p.name} | priority: ${p.priority} | progress: ${p.progress}%${tagsStr}${p.note ? ` | ${p.note}` : ""}`);
      }
    }
    if (pendingProjects.length > 0) {
      lines.push(`Pending (${pendingProjects.length}): ${pendingProjects.map((p) => p.name).join(", ")}`);
    }
    if (backlogProjects.length > 0) {
      lines.push(`Backlog (${backlogProjects.length}): ${backlogProjects.map((p) => p.name).join(", ")}`);
    }
    lines.push("");
  }

  // Pipeline
  if (s.pipelineItems.length > 0) {
    lines.push("## Pipeline");
    for (const item of s.pipelineItems) {
      const stage = s.workflowStages.find((ws) => ws.id === item.stage);
      const stageLabel = stage ? stage.label : `Stage ${item.stage}`;
      const gatesTotal = item.gates.length;
      const gatesDone = item.gates.filter(Boolean).length;
      const tagsStr = item.tags.length > 0 ? ` [${item.tags.join(", ")}]` : "";
      lines.push(`  - "${item.title}" | ${stageLabel} | gates: ${gatesDone}/${gatesTotal}${tagsStr}${item.hook ? ` | ${item.hook}` : ""}`);
    }
    lines.push("");
  }

  // Ideas
  if (s.ideas.length > 0) {
    const rawIdeas = s.ideas.filter((i) => i.stage === "raw");
    const sortedIdeas = s.ideas.filter((i) => i.stage === "sorted");
    const selectedIdeas = s.ideas.filter((i) => i.stage === "selected");
    lines.push(`## Ideas (${s.ideas.length} total)`);
    if (selectedIdeas.length > 0) {
      lines.push(`Selected (${selectedIdeas.length}): ${selectedIdeas.map((i) => i.text).slice(0, 5).join(" | ")}`);
    }
    if (sortedIdeas.length > 0) {
      lines.push(`Sorted (${sortedIdeas.length}): ${sortedIdeas.map((i) => i.text).slice(0, 5).join(" | ")}`);
    }
    if (rawIdeas.length > 0) {
      lines.push(`Raw/unprocessed (${rawIdeas.length})`);
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
      lines.push(`  - ${def.label}: ${current}${def.unit} (3m target: ${def.target3m}${def.unit}, at ${pctStr})`);
    }
    lines.push("");
  }

  // Phases
  const activePhaseTasks = s.phases.flatMap((p) =>
    p.tasks.filter((t) => !t.done).map((t) => ({ phase: p.label, task: t.text }))
  );
  if (activePhaseTasks.length > 0) {
    lines.push("## Pending Phase Tasks (sample)");
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
    lines.push("## Recent Retrospectives");
    for (const r of recentRetros) {
      lines.push(`Week ${r.weekKey}: energy ${r.energyScore}/10 · satisfaction ${r.satisfactionScore}/10`);
      if (r.accomplished) lines.push(`  Accomplished: ${r.accomplished}`);
      if (r.blockers) lines.push(`  Blockers: ${r.blockers}`);
      if (r.nextWeekIntent) lines.push(`  Next intent: ${r.nextWeekIntent}`);
    }
    lines.push("");
  }

  // Top principles (sample)
  if (s.principles.length > 0) {
    lines.push("## Key Principles (sample)");
    for (const p of s.principles.slice(0, 3)) {
      lines.push(`  - ${p.text}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

// ─── Markdown renderer (shared) ───────────────────────────────────────────────

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function renderMarkdown(text: string, headingColor: string): string {
  // First pass: extract and protect code blocks
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
    .replace(/\x00CODEBLOCK(\d+)\x00/g, (_m, i) => codeBlocks[Number(i)])
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
    .replace(/\n/g, "<br/>");
}

// ─── Streaming API call ───────────────────────────────────────────────────────

export async function* streamAiResponse(
  messages: AiMessage[],
  config: AiConfig
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
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(`API error ${response.status}: ${errorText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed === "data: [DONE]") continue;
      if (!trimmed.startsWith("data: ")) continue;

      try {
        const json = JSON.parse(trimmed.slice(6));
        const delta = json.choices?.[0]?.delta?.content;
        if (typeof delta === "string" && delta.length > 0) {
          yield delta;
        }
      } catch {
        // skip malformed SSE lines
      }
    }
  }
}

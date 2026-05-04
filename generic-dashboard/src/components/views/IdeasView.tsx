import { useState, useRef } from "react";
import { useStore } from "../../store/useStore";
import { C, FONT } from "../../theme";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { SectionTitle } from "../ui/SectionTitle";
import { Card } from "../ui/Card";
import { Tag } from "../ui/Badge";
import { Modal, inputStyle, labelStyle, formRow, btnPrimary, btnSecondary, btnDanger } from "../ui/Modal";
import { streamAiResponse, renderMarkdown } from "../../services/aiService";
import type { Idea, IdeaStage, AiMessage } from "../../types";

type IdeaStatus = IdeaStage;

function genId() {
  return `idea-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

const STATUS_LABELS: Record<IdeaStatus, string> = {
  raw: "Raw",
  sorted: "Sorted",
  selected: "Selected",
};

const STATUS_COLORS: Record<IdeaStatus, string> = {
  raw: C.textDim,
  sorted: C.amber,
  selected: C.green,
};

type ReviewScope = "raw" | "selected" | "all";
type ReviewMode = "enhance" | "validate";

const REVIEW_SCOPE_LABELS: Record<ReviewScope, string> = {
  raw: "Raw ideas",
  selected: "Selected ideas",
  all: "All ideas",
};

const REVIEW_MODE_LABELS: Record<ReviewMode, string> = {
  enhance: "Enhance",
  validate: "Validate & prioritize",
};

const REVIEW_MODE_DESCRIPTIONS: Record<ReviewMode, string> = {
  enhance: "Get concrete improvement suggestions, missing angles, and ways to strengthen each idea.",
  validate: "Assess feasibility, alignment with current goals, and prioritization recommendations.",
};

const ENHANCE_PROMPT_TEMPLATE = (scopeLabel: string, context: string, ideaList: string) =>
  `Below are ${scopeLabel} from my idea bank. For each one, provide:\n- A concrete enhancement suggestion or missing angle\n- One specific next action to develop it further\nBe concise (2-3 lines per idea).${context}\n\nIdeas:\n${ideaList}`;

const VALIDATE_PROMPT_TEMPLATE = (scopeLabel: string, context: string, ideaList: string) =>
  `Below are ${scopeLabel} from my idea bank. For each one:\n- Assess its feasibility and strategic fit with current goals\n- Give a priority score (High/Medium/Low) with a one-sentence rationale\n- Flag any risks or blockers\nBe concise.${context}\n\nIdeas:\n${ideaList}`;

export default function IdeasView() {
  const ideas = useStore((s) => s.ideas);
  const addIdea = useStore((s) => s.addIdea);
  const updateIdea = useStore((s) => s.updateIdea);
  const removeIdea = useStore((s) => s.removeIdea);
  const appConfig = useStore((s) => s.appConfig);
  const quarter = useStore((s) => s.quarter);

  const [showModal, setShowModal] = useState(false);
  const [editIdea, setEditIdea] = useState<Idea | null>(null);

  const { isMobile, isTablet } = useBreakpoint();

  const [iText, setIText] = useState("");
  const [iSource, setISource] = useState("");
  const [iTags, setITags] = useState("");
  const [iStatus, setIStatus] = useState<IdeaStatus>("raw");

  // ── AI Review state ──────────────────────────────────────────────────────────
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewScope, setReviewScope] = useState<ReviewScope>("raw");
  const [reviewMode, setReviewMode] = useState<ReviewMode>("enhance");
  const [reviewOutput, setReviewOutput] = useState("");
  const [reviewStreaming, setReviewStreaming] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const abortReviewRef = useRef(false);

  function openNew() {
    setEditIdea(null);
    setIText("");
    setISource("");
    setITags("");
    setIStatus("raw");
    setShowModal(true);
  }

  function openEdit(idea: Idea) {
    setEditIdea(idea);
    setIText(idea.text);
    setISource(idea.source ?? "");
    setITags((idea.tags ?? []).join(", "));
    setIStatus(idea.stage);
    setShowModal(true);
  }

  function save() {
    if (!iText.trim()) return;
    const tags = iTags.split(",").map((t) => t.trim()).filter(Boolean);
    if (editIdea) {
      updateIdea(editIdea.id, {
        text: iText.trim(),
        source: iSource.trim(),
        tags,
        stage: iStatus,
      });
    } else {
      addIdea({
        id: genId(),
        text: iText.trim(),
        source: iSource.trim(),
        tags,
        stage: iStatus,
        createdAt: new Date().toISOString(),
      });
    }
    setShowModal(false);
  }

  const columns: IdeaStatus[] = ["raw", "sorted", "selected"];

  const advance = (idea: Idea) => {
    const order: IdeaStatus[] = ["raw", "sorted", "selected"];
    const cur = order.indexOf(idea.stage);
    if (cur < order.length - 1) {
      updateIdea(idea.id, { stage: order[cur + 1] });
    }
  };

  const retreat = (idea: Idea) => {
    const order: IdeaStatus[] = ["raw", "sorted", "selected"];
    const cur = order.indexOf(idea.stage);
    if (cur > 0) {
      updateIdea(idea.id, { stage: order[cur - 1] });
    }
  };

  // ── AI Review ────────────────────────────────────────────────────────────────
  async function runAiReview() {
    const apiKey = appConfig.aiApiKey?.trim();
    if (!apiKey) {
      setReviewError("No API key configured. Set it in Settings → AI Advisor.");
      return;
    }

    const targetIdeas = reviewScope === "all"
      ? ideas
      : ideas.filter((i) => i.stage === (reviewScope === "raw" ? "raw" : "selected"));

    if (targetIdeas.length === 0) {
      setReviewError(`No ${REVIEW_SCOPE_LABELS[reviewScope].toLowerCase()} to review. Add some ideas first.`);
      return;
    }

    setReviewError(null);
    setReviewOutput("");
    setReviewStreaming(true);
    abortReviewRef.current = false;

    const ideaList = targetIdeas
      .map((idea, idx) => {
        const tags = (idea.tags ?? []).length > 0 ? ` [tags: ${idea.tags.join(", ")}]` : "";
        const source = idea.source ? ` (source: ${idea.source})` : "";
        return `${idx + 1}. "${idea.text}"${source}${tags}`;
      })
      .join("\n");

    const contextLines: string[] = [];
    if (quarter.goal) contextLines.push(`Current quarter goal: ${quarter.goal}`);
    if (quarter.theme) contextLines.push(`Quarter theme: ${quarter.theme}`);
    const context = contextLines.length > 0 ? `\n\nContext:\n${contextLines.join("\n")}` : "";

    const systemContent =
      appConfig.aiSystemPrompt?.trim() ||
      "You are a strategic advisor embedded in a project management dashboard. Provide concise, actionable insights.";

    const userContent = reviewMode === "enhance"
      ? ENHANCE_PROMPT_TEMPLATE(REVIEW_SCOPE_LABELS[reviewScope].toLowerCase(), context, ideaList)
      : VALIDATE_PROMPT_TEMPLATE(REVIEW_SCOPE_LABELS[reviewScope].toLowerCase(), context, ideaList);

    const messages: AiMessage[] = [
      { role: "system", content: systemContent, ts: 0 },
      { role: "user", content: userContent, ts: Date.now() },
    ];

    try {
      let accumulated = "";
      const gen = streamAiResponse(messages, {
        apiKey,
        baseUrl: appConfig.aiBaseUrl || "https://api.openai.com/v1",
        model: appConfig.aiModel || "gpt-4o-mini",
        systemPrompt: systemContent,
      });
      for await (const chunk of gen) {
        if (abortReviewRef.current) break;
        accumulated += chunk;
        setReviewOutput(accumulated);
      }
    } catch (err) {
      setReviewError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setReviewStreaming(false);
    }
  }

  return (
    <div>
      <SectionTitle
        sub={`${ideas.length} ideas captured`}
        action={
          <button onClick={openNew} style={{ ...btnPrimary, fontSize: "0.8rem" }}>
            + Idea
          </button>
        }
      >
        Ideas
      </SectionTitle>

      {/* Kanban */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "1fr 1fr 1fr", gap: "1rem" }}>
        {columns.map((col) => {
          const colIdeas = ideas.filter((i) => i.stage === col);
          return (
            <div key={col}>
              {/* Column header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: "0.75rem",
                  paddingBottom: "0.5rem",
                  borderBottom: `2px solid ${STATUS_COLORS[col]}40`,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: STATUS_COLORS[col],
                    display: "inline-block",
                  }}
                />
                <span style={{ fontSize: "0.85rem", color: STATUS_COLORS[col], fontWeight: 600 }}>
                  {STATUS_LABELS[col]}
                </span>
                <span
                  style={{
                    fontSize: "0.7rem",
                    background: C.surfaceAlt,
                    color: C.textDim,
                    borderRadius: 10,
                    padding: "1px 7px",
                  }}
                >
                  {colIdeas.length}
                </span>
              </div>

              {/* Ideas */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {colIdeas.map((idea) => (
                  <Card key={idea.id} hover>
                    <p style={{ margin: "0 0 8px", fontSize: "0.85rem", color: C.text, lineHeight: 1.5 }}>
                      {idea.text}
                    </p>
                    {idea.source && (
                      <p style={{ margin: "0 0 6px", fontSize: "0.72rem", color: C.textDim }}>
                        Source: {idea.source}
                      </p>
                    )}
                    {(idea.tags ?? []).length > 0 && (
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                        {(idea.tags ?? []).map((tag) => (
                          <Tag key={tag} label={tag} />
                        ))}
                      </div>
                    )}
                    <div style={{ display: "flex", gap: 4, justifyContent: "space-between" }}>
                      <div style={{ display: "flex", gap: 4 }}>
                        {col !== "raw" && (
                          <button
                            onClick={() => retreat(idea)}
                            style={{
                              padding: "2px 8px",
                              background: C.surfaceAlt,
                              border: `1px solid ${C.border}`,
                              borderRadius: 4,
                              color: C.textDim,
                              cursor: "pointer",
                              fontSize: "0.72rem",
                            }}
                          >
                            ←
                          </button>
                        )}
                        {col !== "selected" && (
                          <button
                            onClick={() => advance(idea)}
                            style={{
                              padding: "2px 8px",
                              background: `${STATUS_COLORS[col]}10`,
                              border: `1px solid ${STATUS_COLORS[col]}30`,
                              borderRadius: 4,
                              color: STATUS_COLORS[col],
                              cursor: "pointer",
                              fontSize: "0.72rem",
                            }}
                          >
                            →
                          </button>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button
                          onClick={() => openEdit(idea)}
                          style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: "0.72rem" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeIdea(idea.id)}
                          style={{ background: "none", border: "none", color: C.textVeryDim, cursor: "pointer", fontSize: "0.72rem" }}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
                {colIdeas.length === 0 && (
                  <div
                    style={{
                      padding: "1.5rem",
                      textAlign: "center",
                      color: C.textVeryDim,
                      fontSize: "0.78rem",
                      border: `1px dashed ${C.border}`,
                      borderRadius: 8,
                    }}
                  >
                    Empty
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── AI Review Panel ───────────────────────────────────────────────────── */}
      <div style={{ marginTop: "1.5rem" }}>
        {/* Toggle header */}
        <button
          onClick={() => {
            setReviewOpen((o) => !o);
            setReviewOutput("");
            setReviewError(null);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: reviewOpen ? C.surfaceAlt : "transparent",
            border: `1px solid ${reviewOpen ? C.borderLight : C.border}`,
            borderRadius: reviewOpen ? "8px 8px 0 0" : 8,
            padding: "0.55rem 1rem",
            cursor: "pointer",
            color: reviewOpen ? C.text : C.textMuted,
            fontSize: "0.82rem",
            fontWeight: 600,
            width: "100%",
            textAlign: "left",
            transition: "background 0.15s, border-color 0.15s",
          }}
        >
          <span style={{ color: C.accent }}>✦</span>
          <span>AI Review</span>
          <span style={{ fontSize: "0.7rem", color: C.textDim, fontWeight: 400, marginLeft: 4 }}>
            — get enhancement or validation feedback on your ideas
          </span>
          <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: C.textDim }}>
            {reviewOpen ? "▲" : "▼"}
          </span>
        </button>

        {/* Expanded panel */}
        {reviewOpen && (
          <div
            style={{
              background: C.surfaceAlt,
              border: `1px solid ${C.borderLight}`,
              borderTop: "none",
              borderRadius: "0 0 8px 8px",
              padding: "1rem",
            }}
          >
            {/* No API key warning */}
            {!appConfig.aiApiKey?.trim() && (
              <div
                style={{
                  background: `${C.amber}12`,
                  border: `1px solid ${C.amber}30`,
                  borderRadius: 6,
                  padding: "0.6rem 0.9rem",
                  marginBottom: "1rem",
                  fontSize: "0.78rem",
                  color: C.amber,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <span>⚠ No API key configured.</span>
                <button
                  onClick={() => {
                    const store = useStore.getState();
                    store.setSettingsDeepLinkTab("ai");
                    store.setActiveView("settings");
                  }}
                  style={{ background: "none", border: "none", color: C.accent, cursor: "pointer", fontSize: "0.78rem", textDecoration: "underline", padding: 0 }}
                >
                  Open Settings → AI Advisor
                </button>
              </div>
            )}

            {/* Controls row */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                alignItems: "flex-end",
                marginBottom: "0.85rem",
              }}
            >
              {/* Scope */}
              <div>
                <div style={{ fontSize: "0.72rem", color: C.textDim, marginBottom: 6 }}>Ideas to review</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {(["raw", "selected", "all"] as ReviewScope[]).map((scope) => {
                    const count =
                      scope === "all"
                        ? ideas.length
                        : ideas.filter((i) => i.stage === scope).length;
                    const active = reviewScope === scope;
                    return (
                      <button
                        key={scope}
                        onClick={() => setReviewScope(scope)}
                        style={{
                          padding: "0.35rem 0.75rem",
                          borderRadius: 20,
                          border: `1px solid ${active ? C.accent : C.border}`,
                          background: active ? `${C.accent}18` : C.surface,
                          color: active ? C.text : C.textMuted,
                          cursor: "pointer",
                          fontSize: "0.78rem",
                          fontWeight: active ? 600 : 400,
                          transition: "all 0.15s",
                        }}
                      >
                        {REVIEW_SCOPE_LABELS[scope]}
                        <span
                          style={{
                            marginLeft: 5,
                            fontSize: "0.68rem",
                            background: count > 0 ? `${C.accent}22` : C.surfaceAlt,
                            color: count > 0 ? C.accent : C.textDim,
                            borderRadius: 10,
                            padding: "0 5px",
                          }}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mode */}
              <div>
                <div style={{ fontSize: "0.72rem", color: C.textDim, marginBottom: 6 }}>Review type</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {(["enhance", "validate"] as ReviewMode[]).map((mode) => {
                    const active = reviewMode === mode;
                    return (
                      <button
                        key={mode}
                        onClick={() => setReviewMode(mode)}
                        style={{
                          padding: "0.35rem 0.85rem",
                          borderRadius: 20,
                          border: `1px solid ${active ? C.violet : C.border}`,
                          background: active ? `${C.violet}18` : C.surface,
                          color: active ? C.text : C.textMuted,
                          cursor: "pointer",
                          fontSize: "0.78rem",
                          fontWeight: active ? 600 : 400,
                          transition: "all 0.15s",
                        }}
                      >
                        {REVIEW_MODE_LABELS[mode]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Run button */}
              <div style={{ marginLeft: "auto" }}>
                {reviewStreaming ? (
                  <button
                    onClick={() => { abortReviewRef.current = true; }}
                    style={{
                      background: C.red,
                      border: "none",
                      color: "#fff",
                      padding: "0.45rem 1.1rem",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                    }}
                  >
                    Stop
                  </button>
                ) : (
                  <button
                    onClick={runAiReview}
                    disabled={!appConfig.aiApiKey?.trim()}
                    style={{
                      background: appConfig.aiApiKey?.trim() ? C.accent : C.surfaceAlt,
                      border: "none",
                      color: appConfig.aiApiKey?.trim() ? "#fff" : C.textDim,
                      padding: "0.45rem 1.1rem",
                      borderRadius: 6,
                      cursor: appConfig.aiApiKey?.trim() ? "pointer" : "default",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      transition: "background 0.15s",
                    }}
                  >
                    Run AI Review →
                  </button>
                )}
              </div>
            </div>

            {/* Mode description */}
            <div style={{ fontSize: "0.73rem", color: C.textDim, marginBottom: "0.75rem" }}>
              {REVIEW_MODE_DESCRIPTIONS[reviewMode]}
            </div>

            {/* Error */}
            {reviewError && (
              <div
                style={{
                  background: `${C.red}10`,
                  border: `1px solid ${C.red}25`,
                  borderRadius: 6,
                  padding: "0.55rem 0.85rem",
                  fontSize: "0.78rem",
                  color: C.red,
                  marginBottom: "0.75rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{reviewError}</span>
                <button
                  onClick={() => setReviewError(null)}
                  style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: "0.85rem" }}
                >
                  ×
                </button>
              </div>
            )}

            {/* Streaming / output */}
            {(reviewOutput || reviewStreaming) && (
              <div
                style={{
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  padding: "0.85rem 1rem",
                  fontSize: "0.84rem",
                  color: C.text,
                  lineHeight: 1.65,
                  maxHeight: 480,
                  overflowY: "auto",
                  fontFamily: FONT.body,
                }}
              >
                {reviewOutput ? (
                  <div dangerouslySetInnerHTML={{ __html: renderMarkdown(reviewOutput, C.text) }} />
                ) : (
                  <span style={{ color: C.textDim, display: "flex", alignItems: "center", gap: 6 }}>
                    <span>●</span> Analyzing…
                  </span>
                )}
              </div>
            )}

            {/* Reset button when done */}
            {reviewOutput && !reviewStreaming && (
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.6rem" }}>
                <button
                  onClick={() => { setReviewOutput(""); setReviewError(null); }}
                  style={{
                    background: "none",
                    border: `1px solid ${C.border}`,
                    color: C.textMuted,
                    padding: "0.3rem 0.85rem",
                    borderRadius: 5,
                    cursor: "pointer",
                    fontSize: "0.75rem",
                  }}
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title={editIdea ? "Edit Idea" : "Capture Idea"}>
        <div style={formRow}>
          <label style={labelStyle}>Idea</label>
          <textarea
            value={iText}
            onChange={(e) => setIText(e.target.value)}
            style={{ ...inputStyle, height: 80, resize: "vertical" }}
            placeholder="Describe the idea…"
            autoFocus
          />
        </div>
        <div style={formRow}>
          <label style={labelStyle}>Source / inspiration</label>
          <input value={iSource} onChange={(e) => setISource(e.target.value)} style={inputStyle} placeholder="Where did this come from?" />
        </div>
        <div style={formRow}>
          <label style={labelStyle}>Tags (comma-separated)</label>
          <input value={iTags} onChange={(e) => setITags(e.target.value)} style={inputStyle} placeholder="design, growth, feature" />
        </div>
        <div style={formRow}>
          <label style={labelStyle}>Status</label>
          <select value={iStatus} onChange={(e) => setIStatus(e.target.value as IdeaStatus)} style={{ ...inputStyle, cursor: "pointer" }}>
            {columns.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "space-between" }}>
          {editIdea && <button onClick={() => { removeIdea(editIdea.id); setShowModal(false); }} style={btnDanger}>Delete</button>}
          <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
            <button onClick={() => setShowModal(false)} style={btnSecondary}>Cancel</button>
            <button onClick={save} style={btnPrimary}>Save</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

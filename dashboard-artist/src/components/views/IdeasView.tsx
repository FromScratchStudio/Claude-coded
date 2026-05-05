import { useState, useRef, useEffect, useCallback } from "react";
import { C, FONT } from "../../theme";
import { useStore } from "../../store/useStore";
import Card from "../ui/Card";
import SectionTitle from "../ui/SectionTitle";
import { Tag } from "../ui/Badge";
import type { IdeaStage, AiMessage } from "../../types";
import { buildContextSnapshot, streamAiResponse, renderMarkdown, AI_PROVIDERS } from "../../services/aiService";

const STAGE_LABELS: Record<IdeaStage, string> = {
  raw: "Brut",
  sorted: "Trié",
  selected: "Retenu",
};

const STAGE_COLORS: Record<IdeaStage, string> = {
  raw: C.textDim,
  sorted: C.amber,
  selected: C.green,
};

function IdeaCard({ idea, onAdvance, onRemove }: { idea: { id: string; text: string; source: string; stage: IdeaStage; project?: string; createdAt: string }; onAdvance: (id: string) => void; onRemove: (id: string) => void }) {
  const projects = useStore((s) => s.projects);
  const project = idea.project ? projects.find((p) => p.id === idea.project) : undefined;

  return (
    <div style={{ background: C.bg, borderRadius: 8, padding: "0.75rem", border: `1px solid ${C.border}`, marginBottom: "0.5rem" }}>
      <p style={{ fontSize: "0.8rem", color: C.text, margin: 0, lineHeight: 1.5, marginBottom: "0.5rem" }}>{idea.text}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "0.5rem" }}>
        {idea.source && (
          <span style={{ fontFamily: FONT.mono, fontSize: "0.58rem", color: C.textDim, background: C.surfaceAlt, borderRadius: 4, padding: "0.1rem 0.35rem" }}>
            {idea.source}
          </span>
        )}
        {project && <Tag>{project.name}</Tag>}
      </div>
      <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
        {idea.stage !== "selected" && (
          <button
            onClick={() => onAdvance(idea.id)}
            style={{
              background: `${STAGE_COLORS[idea.stage === "raw" ? "sorted" : "selected"]}18`,
              border: `1px solid ${STAGE_COLORS[idea.stage === "raw" ? "sorted" : "selected"]}44`,
              color: STAGE_COLORS[idea.stage === "raw" ? "sorted" : "selected"],
              borderRadius: 5,
              padding: "0.2rem 0.55rem",
              fontSize: "0.65rem",
              cursor: "pointer",
              fontFamily: FONT.mono,
            }}
          >
            → {STAGE_LABELS[idea.stage === "raw" ? "sorted" : "selected"]}
          </button>
        )}
        <button
          onClick={() => onRemove(idea.id)}
          aria-label="Supprimer l'idée"
          style={{ background: "none", border: `1px solid ${C.border}`, color: C.textDim, borderRadius: 5, padding: "0.2rem 0.45rem", fontSize: "0.65rem", cursor: "pointer" }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default function IdeasView() {
  const ideas = useStore((s) => s.ideas);
  const addIdea = useStore((s) => s.addIdea);
  const removeIdea = useStore((s) => s.removeIdea);
  const advanceIdea = useStore((s) => s.advanceIdea);
  const projects = useStore((s) => s.projects);
  const aiConfig = useStore((s) => s.aiConfig);
  const aiConversations = useStore((s) => s.aiConversations);
  const activeConversationId = useStore((s) => s.activeConversationId);
  const createAiConversation = useStore((s) => s.createAiConversation);
  const appendAiMessage = useStore((s) => s.appendAiMessage);
  const updateLastAiMessage = useStore((s) => s.updateLastAiMessage);
  const removeLastAiMessage = useStore((s) => s.removeLastAiMessage);
  const setActiveConversationId = useStore((s) => s.setActiveConversationId);
  const setActiveView = useStore((s) => s.setActiveView);

  const [newText, setNewText] = useState("");
  const [newSource, setNewSource] = useState("");
  const [newProjectId, setNewProjectId] = useState<string>("");
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Abort any in-progress SSE stream when the component unmounts
  useEffect(() => () => { abortRef.current?.abort(); }, []);

  const activeConversation = aiConversations.find((c) => c.id === activeConversationId) ?? null;

  const getSnapshot = useCallback((): string => {
    const state = useStore.getState();
    return buildContextSnapshot(state);
  }, []);

  const providerDef = AI_PROVIDERS.find((p) => p.id === (aiConfig.provider ?? "openai"));
  const activeProviderConfig = aiConfig.providers?.[aiConfig.provider ?? "openai"];
  const hasApiKey = !providerDef?.requiresApiKey || !!activeProviderConfig?.apiKey?.trim();

  async function sendAiMessage(text: string) {
    if (!text.trim() || isStreaming) return;

    const providerId = aiConfig.provider ?? "openai";
    const providerConfig = aiConfig.providers?.[providerId];
    const apiKey = providerConfig?.apiKey?.trim() ?? "";

    if (providerDef?.requiresApiKey && !apiKey) {
      setAiError("Aucune clé API configurée. Allez dans Réglages → Conseiller IA.");
      return;
    }
    setAiError(null);

    let convId = activeConversationId;
    if (!convId) {
      convId = createAiConversation(text.slice(0, 60));
    }

    const userMsg: AiMessage = { role: "user", content: text.trim(), ts: Date.now() };
    appendAiMessage(convId, userMsg);
    setAiInput("");

    const snapshot = getSnapshot();
    const systemContent = (aiConfig.systemPrompt || "") +
      `\n\n## Données actuelles du tableau de bord:\n${snapshot}`;

    const currentConv = useStore.getState().aiConversations.find((c) => c.id === convId);
    const historyMessages: AiMessage[] = currentConv?.messages ?? [userMsg];
    const apiMessages: AiMessage[] = [
      { role: "system", content: systemContent, ts: 0 },
      ...historyMessages,
    ];

    const assistantMsg: AiMessage = { role: "assistant", content: "", ts: Date.now() };
    appendAiMessage(convId, assistantMsg);

    setIsStreaming(true);
    const controller = new AbortController();
    abortRef.current = controller;

    const supportsBaseUrlOverride = providerId === "custom" || providerId === "ollama";
    const baseUrl = supportsBaseUrlOverride
      ? (providerConfig?.baseUrl?.trim() || providerDef?.baseUrl || "")
      : (providerDef?.baseUrl ?? "https://api.openai.com/v1");

    if (providerId === "custom" && !baseUrl) {
      setAiError("Le fournisseur personnalisé nécessite une URL de base dans les Réglages.");
      removeLastAiMessage(convId);
      setIsStreaming(false);
      abortRef.current = null;
      return;
    }

    const model = providerConfig?.model?.trim() || providerDef?.defaultModel || "gpt-4o-mini";

    try {
      let accumulated = "";
      const gen = streamAiResponse(
        apiMessages,
        { provider: providerId, apiKey, baseUrl, model, systemPrompt: systemContent },
        controller.signal
      );
      for await (const chunk of gen) {
        accumulated += chunk;
        updateLastAiMessage(convId, accumulated);
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        const conv = useStore.getState().aiConversations.find((c) => c.id === convId);
        const msgs = conv?.messages ?? [];
        const lastMsg = msgs[msgs.length - 1];
        if (lastMsg?.role === "assistant" && !lastMsg.content) {
          removeLastAiMessage(convId);
        }
      } else {
        const message = err instanceof Error ? err.message : "Erreur inconnue";
        updateLastAiMessage(convId, `⚠ Erreur: ${message}`);
        setAiError(message);
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }

  const handleAdd = () => {
    const trimmed = newText.trim();
    if (!trimmed) return;
    addIdea({
      id: crypto.randomUUID ? crypto.randomUUID() : `idea-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      text: trimmed,
      source: newSource.trim(),
      project: newProjectId || undefined,
      stage: "raw",
      createdAt: new Date().toISOString(),
    });
    setNewText("");
    setNewSource("");
    setNewProjectId("");
  };

  const columns: { stage: IdeaStage; label: string; color: string }[] = [
    { stage: "raw", label: "Brut", color: C.textDim },
    { stage: "sorted", label: "Trié", color: C.amber },
    { stage: "selected", label: "Retenu", color: C.green },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "1.25rem" }}>
        <h2 style={{ fontFamily: FONT.display, fontSize: "1.2rem", color: C.text, margin: 0 }}>Pipeline d'idées</h2>
        <p style={{ fontSize: "0.7rem", color: C.textDim, margin: "0.2rem 0 0", fontFamily: FONT.mono }}>
          Brut → Trié → Retenu — filtrer les idées avant de s'engager
        </p>
      </div>

      {/* Add idea */}
      <Card style={{ marginBottom: "1.25rem" }}>
        <SectionTitle accent={C.gold}>Ajouter une idée</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 200px 200px auto", gap: "0.5rem", alignItems: "flex-end" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Idée</label>
            <input
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Décrire l'idée..."
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "0.4rem 0.65rem", fontSize: "0.8rem", width: "100%" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Source</label>
            <input
              value={newSource}
              onChange={(e) => setNewSource(e.target.value)}
              placeholder="vie, rêve, lecture..."
              style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "0.4rem 0.65rem", fontSize: "0.8rem", width: "100%" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.62rem", color: C.textDim, fontFamily: FONT.mono, marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Projet lié</label>
            <select
              value={newProjectId}
              onChange={(e) => setNewProjectId(e.target.value)}
              style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "0.4rem 0.5rem", fontSize: "0.8rem", width: "100%" }}
            >
              <option value="">Aucun</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleAdd}
            disabled={!newText.trim()}
            style={{
              background: newText.trim() ? C.gold : C.surfaceAlt,
              border: "none",
              color: newText.trim() ? C.bg : C.textDim,
              borderRadius: 6,
              padding: "0.45rem 1.2rem",
              fontSize: "0.78rem",
              fontWeight: "bold",
              cursor: newText.trim() ? "pointer" : "not-allowed",
              fontFamily: FONT.mono,
              alignSelf: "flex-end",
            }}
          >
            + Ajouter
          </button>
        </div>
      </Card>

      {/* Kanban columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
        {columns.map(({ stage, label, color }) => {
          const stageIdeas = ideas.filter((i) => i.stage === stage);
          return (
            <div key={stage}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem", padding: "0.4rem 0.65rem", background: C.surface, borderRadius: 8, border: `1px solid ${color}30` }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
                <span style={{ fontFamily: FONT.mono, fontSize: "0.7rem", color, textTransform: "uppercase", letterSpacing: "0.1em", flex: 1 }}>{label}</span>
                <span style={{ fontFamily: FONT.mono, fontSize: "0.68rem", color: C.textDim }}>{stageIdeas.length}</span>
              </div>
              {stageIdeas.length === 0 ? (
                <div style={{ padding: "1.5rem", textAlign: "center", color: C.textDim, fontSize: "0.68rem", fontFamily: FONT.mono, border: `1px dashed ${C.border}`, borderRadius: 8 }}>
                  Aucune idée
                </div>
              ) : (
                stageIdeas.map((idea) => (
                  <IdeaCard key={idea.id} idea={idea} onAdvance={advanceIdea} onRemove={removeIdea} />
                ))
              )}
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.25rem", justifyContent: "flex-end" }}>
        {columns.map(({ stage, label, color }) => {
          const count = ideas.filter((i) => i.stage === stage).length;
          return (
            <span key={stage} style={{ fontFamily: FONT.mono, fontSize: "0.65rem", color, background: `${color}12`, border: `1px solid ${color}30`, borderRadius: 4, padding: "0.2rem 0.5rem" }}>
              {count} {label.toLowerCase()}
            </span>
          );
        })}
        <span style={{ fontFamily: FONT.mono, fontSize: "0.65rem", color: C.textDim, background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 4, padding: "0.2rem 0.5rem" }}>
          {ideas.length} total
        </span>
      </div>

      {/* IA Conseiller panel */}
      <div style={{ marginTop: "1.5rem", border: `1px solid ${C.violet}30`, borderRadius: 10, overflow: "hidden" }}>
        {/* Toggle header */}
        <button
          onClick={() => setAiPanelOpen((v) => !v)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.75rem 1rem",
            background: aiPanelOpen ? `${C.violet}12` : C.surface,
            border: "none",
            cursor: "pointer",
            borderBottom: aiPanelOpen ? `1px solid ${C.violet}20` : "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1rem" }}>✦</span>
            <span style={{ fontFamily: FONT.mono, fontSize: "0.72rem", color: C.violet, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Conseiller IA — Analyser mes idées
            </span>
          </div>
          <span style={{ fontFamily: FONT.mono, fontSize: "0.65rem", color: C.textDim }}>
            {aiPanelOpen ? "▲ Fermer" : "▼ Ouvrir"}
          </span>
        </button>

        {/* Panel content */}
        {aiPanelOpen && (
          <div style={{ background: C.surface, padding: "1rem" }}>
            {!hasApiKey && (
              <div style={{ background: `${C.amber}12`, border: `1px solid ${C.amber}40`, borderRadius: 6, padding: "0.65rem 0.85rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.78rem", color: C.amber }}>⚠ Clé API requise — configurez-la dans les Réglages</span>
                <button
                  onClick={() => setActiveView("settings")}
                  style={{ background: C.amber, border: "none", color: "#000", padding: "0.3rem 0.75rem", borderRadius: 5, cursor: "pointer", fontSize: "0.75rem", fontWeight: 600 }}
                >
                  Réglages
                </button>
              </div>
            )}

            {/* Quick prompts */}
            {!activeConversation && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: "0.75rem" }}>
                {[
                  "Quelles idées retenues devrais-je prioriser ?",
                  "Quelles idées brutes méritent d'être triées ?",
                  "Quels patterns vois-tu dans mes idées ?",
                ].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => hasApiKey ? sendAiMessage(prompt) : setAiError("Définissez d'abord votre clé API dans les Réglages.")}
                    style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.textSoft, padding: "0.35rem 0.7rem", borderRadius: 16, cursor: "pointer", fontSize: "0.73rem" }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Messages */}
            {activeConversation && (
              <div style={{ maxHeight: 280, overflowY: "auto", marginBottom: "0.75rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {activeConversation.messages
                  .filter((m) => m.role !== "system")
                  .map((msg, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                      <div
                        style={{
                          maxWidth: "85%",
                          padding: "0.5rem 0.8rem",
                          borderRadius: msg.role === "user" ? "10px 10px 2px 10px" : "10px 10px 10px 2px",
                          background: msg.role === "user" ? C.violet : C.surfaceAlt,
                          border: msg.role === "user" ? "none" : `1px solid ${C.border}`,
                          fontSize: "0.82rem",
                          lineHeight: 1.6,
                          color: msg.role === "user" ? "#fff" : C.text,
                        }}
                      >
                        {msg.role === "assistant" ? (
                          <div dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content || "…", C.text) }} />
                        ) : msg.content}
                      </div>
                    </div>
                  ))}
                {isStreaming && (
                  <div style={{ display: "flex", justifyContent: "flex-start" }}>
                    <div style={{ padding: "0.4rem 0.75rem", borderRadius: "10px 10px 10px 2px", background: C.surfaceAlt, border: `1px solid ${C.border}`, fontSize: "0.75rem", color: C.textDim, display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ opacity: 0.5 }}>●</span> En réflexion…
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Error */}
            {aiError && (
              <div style={{ background: `${C.red}12`, border: `1px solid ${C.red}30`, borderRadius: 5, padding: "0.4rem 0.7rem", marginBottom: "0.5rem", fontSize: "0.75rem", color: C.red, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>{aiError}</span>
                <button onClick={() => setAiError(null)} style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: "0.85rem" }}>×</button>
              </div>
            )}

            {/* Input row */}
            <div style={{ display: "flex", gap: 6 }}>
              {activeConversation && (
                <button
                  onClick={() => setActiveConversationId(null)}
                  title="Nouvelle conversation"
                  style={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.textDim, borderRadius: 6, padding: "0.4rem 0.6rem", fontSize: "0.72rem", cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  + Nouveau
                </button>
              )}
              <input
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendAiMessage(aiInput))}
                placeholder="Posez une question sur vos idées…"
                disabled={isStreaming}
                style={{ flex: 1, background: C.bg, border: `1px solid ${C.border}`, color: C.text, borderRadius: 6, padding: "0.4rem 0.65rem", fontSize: "0.8rem", opacity: isStreaming ? 0.6 : 1 }}
              />
              {isStreaming ? (
                <button
                  onClick={() => abortRef.current?.abort()}
                  style={{ background: C.red, border: "none", color: "#fff", borderRadius: 6, padding: "0.4rem 0.75rem", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}
                >
                  Arrêter
                </button>
              ) : (
                <button
                  onClick={() => sendAiMessage(aiInput)}
                  disabled={!aiInput.trim() || !hasApiKey}
                  style={{ background: aiInput.trim() && hasApiKey ? C.violet : C.surfaceAlt, border: "none", color: aiInput.trim() && hasApiKey ? "#fff" : C.textDim, borderRadius: 6, padding: "0.4rem 0.85rem", fontSize: "0.78rem", fontWeight: 600, cursor: aiInput.trim() && hasApiKey ? "pointer" : "default" }}
                >
                  Envoyer ↑
                </button>
              )}
            </div>

            <div style={{ marginTop: "0.5rem", textAlign: "right" }}>
              <button
                onClick={() => setActiveView("ia-conseiller")}
                style={{ background: "none", border: "none", color: C.violet, cursor: "pointer", fontSize: "0.7rem", fontFamily: FONT.mono, textDecoration: "underline" }}
              >
                Ouvrir le Conseiller IA complet →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
